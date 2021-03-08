import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Grid, Card, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
interface PropTypes {
    postId: number
}

const SinglePost = ({ postId }: PropTypes): any => {
    const user: any = useContext(AuthContext)
    const { data: { getPost } } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>

                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt)}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                        <Card.Content extra>
                            {/* <LikeButton user={user} post={{ id, likeCount, likes }} /> */}
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
                        </Card.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
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