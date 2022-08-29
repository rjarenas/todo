import { gql, useQuery } from '@apollo/client';
import QueryResult from './query-results';

/** USER_NAME gql query to retreive user information */
const USER_NAME = gql`
    query GetUserName($userInfoId: ID!) {
        userInfo(id: $userInfoId) {
        name
        }
    }  
`;

const UserInformation = (props) => {
    const { loading, error, data } = useQuery(USER_NAME, {
        variables: { 
            userInfoId: props.user_id 
        }
    });

    return(      
        <QueryResult error={error} loading={loading} data={data}>
            { data?.userInfo.name }
        </QueryResult>);

}

export default UserInformation;