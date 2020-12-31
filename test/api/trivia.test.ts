import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import fetchTriviaQuestions from '../../pages/api/trivia';

test('Only responds to POST', async () => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: 'GET',
  });

  await fetchTriviaQuestions(req, res);
});
