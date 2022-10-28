import axios from 'axios';
import { unstable_getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { API_ROOT } from 'app/constants';

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.send({
      error: 'You must be signed in to view the protected content.',
      status: 401,
    });
  }

  const token = await getToken({ req }); // get JWT token from request
  const accessToken = (token.account as any).accessToken;

  const {
    query: { id, name },
    method,
  } = req;

  switch (method) {
    case 'GET': {
      // Get data from your database
      const profile = await axios.get(
        encodeURI(`${API_ROOT}/api/private/users/profile`),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      res.status(200).json(profile.data);
      break;
    }
    case 'PUT': {
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` });
      break;
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
