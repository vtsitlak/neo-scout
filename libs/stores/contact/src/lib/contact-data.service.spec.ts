import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactDataService } from './contact-data.service';
import { ContactInquiry } from './contact.models';

const sample: ContactInquiry = {
  name: 'Ada',
  workEmail: 'ada@example.com',
  company: 'Analytical Engines',
  employeeCount: '11-50',
  message: 'Hello there, this is long enough.',
};

const configUrl = '/contact.web3forms.json';
const submitUrl = 'https://api.web3forms.com/submit';

/** Wait until HttpClientTestingBackend has a matching request. */
async function expectRequest(
  httpMock: HttpTestingController,
  url: string,
): Promise<TestRequest> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const matches = httpMock.match(url);
    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      throw new Error(
        `Expected one request for ${url}, found ${matches.length}`,
      );
    }
    await Promise.resolve();
  }
  return httpMock.expectOne(url);
}

describe('ContactDataService', () => {
  let service: ContactDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } finally {
      TestBed.resetTestingModule();
    }
  });

  it('should load the access key and POST the inquiry to Web3Forms', async () => {
    const pending = service.submit(sample);

    const configReq = await expectRequest(httpMock, configUrl);
    expect(configReq.request.method).toBe('GET');
    configReq.flush({ accessKey: 'test-access-key' });

    const submitReq = await expectRequest(httpMock, submitUrl);
    expect(submitReq.request.method).toBe('POST');
    expect(submitReq.request.body).toEqual({
      access_key: 'test-access-key',
      subject: 'NEO Scout contact inquiry',
      from_name: 'NEO Scout',
      name: sample.name,
      email: sample.workEmail,
      replyto: sample.workEmail,
      company: sample.company,
      employee_count: sample.employeeCount,
      message: sample.message,
    });
    submitReq.flush({ success: true, message: 'Email sent successfully!' });

    await expect(pending).resolves.toBeUndefined();
  });

  it('should reuse a cached access key on a second submit', async () => {
    const first = service.submit(sample);
    (await expectRequest(httpMock, configUrl)).flush({
      accessKey: 'cached-key',
    });
    (await expectRequest(httpMock, submitUrl)).flush({ success: true });
    await first;

    const second = service.submit(sample);
    const submitReq = await expectRequest(httpMock, submitUrl);
    expect(httpMock.match(configUrl)).toEqual([]);
    expect(submitReq.request.body.access_key).toBe('cached-key');
    submitReq.flush({ success: true });
    await second;
  });

  it('should reject when the access key config is missing', async () => {
    const pending = service.submit(sample);

    (await expectRequest(httpMock, configUrl)).flush('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });

    await expect(pending).rejects.toThrow(/not configured/i);
  });

  it('should reject when the access key is a placeholder', async () => {
    const pending = service.submit(sample);

    (await expectRequest(httpMock, configUrl)).flush({
      accessKey: 'YOUR_ACCESS_KEY_HERE',
    });

    await expect(pending).rejects.toThrow(/not configured/i);
  });

  it('should reject when Web3Forms returns success false', async () => {
    const pending = service.submit(sample);

    (await expectRequest(httpMock, configUrl)).flush({
      accessKey: 'test-access-key',
    });
    (await expectRequest(httpMock, submitUrl)).flush({
      success: false,
      message: 'Invalid Access Key',
    });

    await expect(pending).rejects.toThrow('Invalid Access Key');
  });

  it('should reject with the API message on HTTP error', async () => {
    const pending = service.submit(sample);

    (await expectRequest(httpMock, configUrl)).flush({
      accessKey: 'test-access-key',
    });
    (await expectRequest(httpMock, submitUrl)).flush(
      { success: false, message: 'Rate limit exceeded' },
      { status: 429, statusText: 'Too Many Requests' },
    );

    await expect(pending).rejects.toThrow('Rate limit exceeded');
  });
});
