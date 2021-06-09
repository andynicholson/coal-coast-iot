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

import useSWR, { ConfigInterface } from 'swr';

export default function useRegistrationDetails(opts?: ConfigInterface) {
  const { data, error, mutate } = useSWR(
    `/api/user-registration`,
    async url => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    },
    {
      ...opts,
      revalidateOnFocus: false
    }
  );

  return {
    result: error ? undefined : data,
    mutate
  };
}
