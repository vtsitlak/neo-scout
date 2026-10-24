import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ScoutApiResponse } from './models/scout-api.model';
import { ScoutApiError } from './scout-api.error';
import { ScoutApiService } from './scout-api.service';
import { SCOUT_API_URL } from './scout-api.tokens';

describe('ScoutApiService', () => {
  const testUrl = 'https://example.test/scout.api';
  let service: ScoutApiService;
  let httpMock: HttpTestingController;

  const sampleResponse: ScoutApiResponse = {
    data: [
      {
        objectName: '6K72D21',
        neoScore: 100,
        phaScore: 0,
        neo1kmScore: 0,
        ieoScore: 0,
        geocentricScore: 0,
        tisserandScore: 0,
        rating: 0,
        moid: '0.003',
        caDist: '6.7',
        H: '27.3',
        Vmag: '21.8',
        nObs: 21,
        arc: '24.10',
        rmsN: '0.88',
        unc: '0.47',
        uncP1: '0.58',
        ra: '01:58',
        dec: '+00',
        elong: '167',
        rate: '3.2',
        vInf: '6.5',
        lastRun: '2026-10-09 06:05',
        tEphem: '2026-10-13 18:30',
      },
    ],
    count: '1',
    signature: {
      source: 'NASA/JPL Scout API',
      version: '1.3',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SCOUT_API_URL, useValue: testUrl },
      ],
    });

    service = TestBed.inject(ScoutApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET candidates and return the typed Scout envelope', () => {
    // Arrange
    let actual: ScoutApiResponse | undefined;

    // Act
    service.getCandidates().subscribe((response) => {
      actual = response;
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(sampleResponse);

    // Assert
    expect(actual).toEqual(sampleResponse);
    expect(actual?.data[0]?.objectName).toBe('6K72D21');
  });

  it('should map HTTP failures to ScoutApiError', () => {
    // Arrange
    let captured: unknown;

    // Act
    service.getCandidates().subscribe({
      next: () => {
        throw new Error('expected error path');
      },
      error: (error: unknown) => {
        captured = error;
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('upstream failure', {
      status: 503,
      statusText: 'Service Unavailable',
    });

    // Assert
    expect(captured).toBeInstanceOf(ScoutApiError);
    const scoutError = captured as ScoutApiError;
    expect(scoutError.status).toBe(503);
    expect(scoutError.message).toContain('503');
  });

  it('should map invalid JSON shapes to ScoutApiError', () => {
    let captured: unknown;

    service.getCandidates().subscribe({
      next: () => {
        throw new Error('expected error path');
      },
      error: (error: unknown) => {
        captured = error;
      },
    });

    httpMock.expectOne(testUrl).flush({ data: 'not-an-array' });

    expect(captured).toBeInstanceOf(ScoutApiError);
    expect((captured as ScoutApiError).message).toContain('validation');
  });
});
