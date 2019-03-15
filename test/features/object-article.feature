Feature: Receive, Like, Delete Articles
  The server should handle different activities related to article's via ActivityPub

  Background:
    Given our own server runs at "http://localhost:4123"
    And we have the following users in our database:
      | Slug         |
      | marvin       |
      | max          |

  Scenario: Receiving a Create activity with an Article as object at the shared inbox
    When I send a POST request with the following activity to "/activitypub/users/max/inbox":
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/max/status/faslkasa7dasfzkjn2398hsfd",
      "type": "Create",
      "actor": "https://localhost:4123/activitypub/users/max",
      "object": {
          "id": "https://localhost:4123/activitypub/users/max/status/dkasfljsdfaafg9843jknsdf",
          "type": "Article",
          "published": "2019-02-07T19:37:55.002Z",
          "attributedTo": "https://localhost:4123/activitypub/users/max",
          "content": "Hi Max, how are you?",
          "to": "https://www.w3.org/ns/activitystreams#Public"
      }
    }
    """
    Then I expect the status code to be 200
    And the post with id "dkasfljsdfaafg9843jknsdf" to be created

  Scenario: Send a like of a person to an users inbox and make sure it's added to the likes collection
    When I send a POST request with the following activity to "/activitypub/users/max/inbox":
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/marvin/status/83J23549sda1k72fsa4567na42312455kad83",
      "type": "Like",
      "actor": "http://localhost:4123/activitypub/users/marvin",
      "object": "http://localhost:4123/activitypub/users/max/status/dkasfljsdfaafg9843jknsdf"
    }
    """
    Then I expect the status code to be 200
    And the post with id "dkasfljsdfaafg9843jknsdf" has been liked by "marvin"

  Scenario: Deleting a post (Article Object)
    When I send a POST request with the following activity to "/activitypub/users/max/inbox":
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/max/status/12a4DJ2afdg31323v32641vna42lkj685kasd2g234",
      "type": "Delete",
      "object": {
        "id": "https://localhost:4123/activitypub/users/max/status/dkasfljsdfaafg9843jknsdf",
        "type": "Article",
        "published": "2019-02-07T19:37:55.002Z",
        "attributedTo": "https://localhost:4123/activitypub/users/max",
        "content": "Hi Max, how are you?",
        "to": "https://www.w3.org/ns/activitystreams#Public"
      }
    }
    """
    Then I expect the status code to be 200
    And the post with id "dkasfljsdfaafg9843jknsdf" to be deleted
