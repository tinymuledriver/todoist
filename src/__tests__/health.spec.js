import { getHealth } from '../api/health';

describe('GET /api/health', () => {
  it('returns ok: true', () => {
    const result = getHealth();
    expect(result.ok).toBe(true);
  });

  it('includes a sha field', () => {
    const result = getHealth();
    expect(result).toHaveProperty('sha');
  });

  it('returns the commit sha from REACT_APP_COMMIT_SHA when set', () => {
    const original = process.env.REACT_APP_COMMIT_SHA;
    process.env.REACT_APP_COMMIT_SHA = 'abc1234';
    // Re-import to pick up the env var at call time (function reads it lazily)
    const result = getHealth();
    expect(result.sha).toBe('abc1234');
    process.env.REACT_APP_COMMIT_SHA = original;
  });

  it('returns null for sha when REACT_APP_COMMIT_SHA is not set', () => {
    const original = process.env.REACT_APP_COMMIT_SHA;
    delete process.env.REACT_APP_COMMIT_SHA;
    const result = getHealth();
    expect(result.sha).toBeNull();
    process.env.REACT_APP_COMMIT_SHA = original;
  });
});
