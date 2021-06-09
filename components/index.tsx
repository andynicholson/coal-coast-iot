/**
 * Copyright 2020 Vercel Inc.
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

import { useState } from 'react';
import { PageState, ConfDataContext, UserData } from '@lib/hooks/use-conf-data';
import Ticket from './ticket';
import Layout from './layout';
import ConfContainer from './conf-container';
import Hero from './hero';
import Form from './form';
import LearnMore from './learn-more';
import useLoginStatus from '@lib/hooks/use-login-status';

import { COOKIE, SAMPLE_TICKET_NUMBER } from '@lib/constants';

type Props = {
  defaultUserData: UserData;
  sharePage?: boolean;
  defaultPageState?: PageState;
  name: string;
  ticketNumber: number;
};

export default function Conf({
  defaultUserData,
  sharePage,
  defaultPageState = 'registration', name, ticketNumber
}: Props) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [pageState, setPageState] = useState<PageState>(defaultPageState);
  const { loginStatus, mutate } = useLoginStatus();
  
  return (
    <ConfDataContext.Provider
      value={{
        userData,
        setUserData,
        setPageState
      }}
    >
      <Layout>
        <ConfContainer>
          
          {loginStatus === 'loggedIn' ? ( <div> Welcome Back {name}! You have ticket number {ticketNumber} </div>) : (<></>)}

          {pageState === 'registration' && !sharePage ? (
            <>
              <Hero />
              <Form />
              <LearnMore />
            </>
            
          ) : (
            <Ticket
              username={userData.username}
              name={userData.name}
              ticketNumber={userData.ticketNumber}
              sharePage={sharePage}
            />
          )}
        </ConfContainer>
      </Layout>
    </ConfDataContext.Provider>
  );
}


export async function getServerSideProps(context: { cookies: { [x: string]: any; }; })  {

  const redis = require('@lib/redis');

  const id = context.cookies[COOKIE];
  
  if (redis) {
    if (id) {
      const [name, ticketNumber] = await redis.hmget(`user:${id}`, 'name', 'ticketNumber');

      if (ticketNumber) {
        return {
          props: {
            name: name || null,
            ticketNumber: parseInt(ticketNumber, 10) || null
          },
          revalidate: 5
        };
      }
    }
    return {
      props: {
        name: null,
        ticketNumber: null
      },
      revalidate: 5
    };
  } else {
    return {
      props: {
        name: 'Unknown Person',
        ticketNumber: SAMPLE_TICKET_NUMBER
      },
      revalidate: 5
    };
  }
};
