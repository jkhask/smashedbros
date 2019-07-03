import { TestBed } from '@angular/core/testing';

import { ChallongeService } from './challonge.service';

describe('ChallongeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChallongeService = TestBed.get(ChallongeService);
    expect(service).toBeTruthy();
  });
});
