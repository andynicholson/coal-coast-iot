/**
 * Copyright 2021 Andrew Peter Nicholson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import redis from '@lib/redis';

export default async function userRegistration(req: NextApiRequest, res: NextApiResponse) {
  const id = req.cookies[COOKIE];

  if (redis) {
    if (id) {
      const [name, ticketNumber, username] = await redis.hmget(
        `id:${id}`,
        'name',
        'ticketNumber',
        'username'
      );

      if (ticketNumber) {
        return res.status(200).json({
          id,
          ticketNumber,
          name,
          username
        });
      } else {
        return res.status(401).json({
          error: {
            code: 'not_registered',
            message: 'This user is not registered'
          }
        });
      }
    } else {
      return res.status(401).json({
        error: {
          code: 'missing_cookie',
          message: 'Missing cookie'
        }
      });
    }
  } else {
    return res.status(401).json({
      error: {
        code: 'not_registered',
        message: 'This user is not registered. Redis is not configured.'
      }
    });
  }
}
