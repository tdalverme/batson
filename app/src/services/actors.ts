import { URL_POLLING, URL_POST } from '../utils/IPS';
import { timeout } from '../utils/timeout';

export type CandidatesActorsResponseData = {
  id: string;
  title: string;
};
export type CandidatesActorsResponse = {
  type: 'actors';
  status: string;
  data: CandidatesActorsResponseData[];
};

export type Actor = {
  id: string;
  title: string;
  plot: string;
  plotLocal?: string;
  image: string;
};

const MAX_NUMBER_OF_REQUEST = 40;

export const getCandidatesActorsService = async (
  path: string,
  mime: string,
): Promise<Actor[]> => {
  let numberOfRequest = 0;
  const formData = new FormData();
  formData.append('file', {
    name: 'mobile-file-upload.' + path.split('.').pop(),
    uri: path,
    type: mime,
  });

  const responseID = await fetch(URL_POST, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const {
    data: { id: requestID },
  } = (await responseID.json()) as {
    data: { id: string };
  };

  const polling = async (): Promise<Actor[]> => {
    numberOfRequest++;
    const response = await fetch(URL_POLLING + requestID, {
      method: 'GET',
    });
    const candidatesActorsResponse =
      (await response.json()) as CandidatesActorsResponse;

    if (candidatesActorsResponse.status === 'finished') {
      if (candidatesActorsResponse.data.length > 0) {
        const actorCandidatesWithCompleteInfo =
          candidatesActorsResponse.data.map(
            batson =>
              ({
                ...batson,
                type: 'actor',
                plot: 'Actor',
                image: path,
              } as Actor),
          );

        return actorCandidatesWithCompleteInfo;
      }

      return [];
    } else {
      if (numberOfRequest < MAX_NUMBER_OF_REQUEST) {
        await timeout(250);
        return polling();
      } else {
        throw new Error();
      }
    }
  };
  await timeout(500);
  return polling();
};
