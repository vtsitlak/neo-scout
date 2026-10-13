import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorToastService } from './error-toast.service';

describe('ErrorToastService', () => {
  let service: ErrorToastService;
  let add: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    add = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        ErrorToastService,
        { provide: MessageService, useValue: { add } },
      ],
    });
    service = TestBed.inject(ErrorToastService);
  });

  it('should add a centered error toast with the given message', () => {
    service.show('Scout API failed');

    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Error',
        detail: 'Scout API failed',
      }),
    );
  });

  it('should ignore blank messages', () => {
    service.show('   ');
    expect(add).not.toHaveBeenCalled();
  });
});
