export const getHealth = () => ({
  ok: true,
  sha: process.env.REACT_APP_COMMIT_SHA || null,
});
