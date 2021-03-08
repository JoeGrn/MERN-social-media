import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Grid, Card, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
interface PropTypes {
    match: any
    history: any
}

const SinglePost = ({ match, history }: PropTypes): JSX.Element => {
    const postId = match.params.postId
    const user: any = useContext(AuthContext)
    const { data, loading } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const deletePostCallback = () => {
        history.push('/')
    }

    let postMarkup;
    if (loading) {
        postMarkup = <p>Loading...</p>
    } else {
        console.log(data)
        const { getPost } = data
        const {
            id,
            body,
            createdAt,
            username,
            likes,
            likeCount,
            commentCount
        } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>

                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                        <Card.Content extra>
                            <LikeButton
                                user={user}
                                id={id}
                                likeCount={likeCount}
                                likes={likes}
                            />
                            <Button
                                as="div"
                                labelPosition="right"
                                onClick={() => console.log('commented post')}
                            >
                                <Button basic color="blue">
                                    <Icon name="comments" />
                                    <Label basic color="blue" pointing="left" >
                                        {commentCount}
                                    </Label>
                                </Button>
                            </Button>
                            {user
                                && user.username === username
                                && <DeleteButton
                                    postId={id}
                                    callback={deletePostCallback}
                                />
                            }
                        </Card.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost