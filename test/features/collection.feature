Feature: Receiving collections
  As a member of the Fediverse I want to be able of fetching collections

  Background:
    Given our own server runs at "http://localhost:4123"
    And we have the following users in our database:
      | Slug              |
      | renate-oberdorfer |

  Scenario: Send a request to the outbox URI of peter-lustig and expect a ordered collection
    When I send a GET request to "/activitypub/users/peter-lustig/outbox"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/outbox",
      "summary": "peter-lustigs outbox collection",
      "type": "OrderedCollection",
      "first": "https://localhost:4123/activitypub/users/peter-lustig/outbox?page=true",
      "totalItems": 1
    }
    """

  Scenario: Send a request to the following URI of peter-lustig and expect a ordered collection
    When I send a GET request to "/activitypub/users/peter-lustig/following"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/following",
      "summary": "peter-lustigs following collection",
      "type": "OrderedCollection",
      "first": "https://localhost:4123/activitypub/users/peter-lustig/following?page=true",
      "totalItems": 1
    }
    """

  Scenario: Send a request to the followers URI of peter-lustig and expect a ordered collection
    When I send a GET request to "/activitypub/users/peter-lustig/followers"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/followers",
      "summary": "peter-lustigs followers collection",
      "type": "OrderedCollection",
      "first": "https://localhost:4123/activitypub/users/peter-lustig/followers?page=true",
      "totalItems": 1
    }
    """

  Scenario: Send a request to the outbox URI of peter-lustig and expect a paginated outbox collection
    When I send a GET request to "/activitypub/users/peter-lustig/outbox?page=true"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/outbox?page=true",
      "summary": "peter-lustigs outbox collection",
      "type": "OrderedCollectionPage",
      "totalItems": 1,
      "partOf": "https://localhost:4123/activitypub/users/peter-lustig/outbox",
      "orderedItems": [
      {
        "@context": "https://www.w3.org/ns/activitystreams",
        "actor": "https://localhost:4123/activitypub/users/peter-lustig",
        "id": "https://localhost:4123/activitypub/users/peter-lustig/status/c90b1dc72cd91874943a36cf6e2c202a",
        "object": {
          "attributedTo": "https://localhost:4123/activitypub/users/peter-lustig",
          "content": "<p><strong>Diese Zukunftsstadt ist real und keine Computer-Animation</strong> – sondern sie ist das Lebenswerk des mittlerweile über 100 Jahre alten Futuristen und Architekten Jacque Fresco aus Florida. In 35 Jahren (seit seinem 13. Lebensjahr) hat dieser zusammen mit seiner Frau seinen futuristischen Traum von einer besonderen Zukunftsstadt auf 85.000 Quadratmetern realisiert. In den Gebäuden und Gärten befinden sich u.a. ein Forschungszentrum, Vortragsräume und unzählige seiner Modelle &amp; Architekturentwürfe.</p><br /><p>Sein zentrales Anliegen ist eine resourcenbasierte Wirtschaft und die Abschaffung von Geld und Privatbesitz. Mit Hilfe von Roboterarbeit und dem Bedingungslosen Grundeinkommen (da nach seiner Ansicht in den kommenden Jahren fast alle Jobs automatisiert werden), möchte er eine ökologische Landwirtschaft mit Permakulturen etc. und eine effiziente Energiegewinnung (ausschließlich durch regenerative Energien) schaffen. Wenige kompatible Formen in einer sparsamen Modulbauweise (in die u.a. bereits variable Service- und Reparaturelemente integriert sind) sollen insgesamt eine soziale &amp; ökologische Utopie im Einklang mit der Natur ermöglichen.</p><br /><p>Nachfolgend der Direkt-Link auf den interessanten Artikel von Zoltan Istvan, der den Architekten und seine Frau in Florida besuchen durfte und seinen Artikel Ende 2016 auf „MOTHERBOARD“ veröffentlicht hatte:</p><br /><p><a href=\"https://motherboard.vice.com/de/article/vv34nb/ich-habe-die-zukunft-besucht-in-der-wir-ohne-geld-steuern-und-besitz-leben\" class=\"linkified\" target=\"_blank\">https://motherboard.vice.com/de/article/vv34nb/ich-habe-die-zukunft-besucht-in-der-wir-ohne-geld-steuern-und-besitz-leben</a></p><br /><p>Da soll noch jemand behaupten, es gäbe keine Utopien mehr bzw. keine Futuristen, die ihre kreativen und zukunftsfähigen Ideen (auch in ganz großem Stil) selbst in die Tat umsetzen. LG @all :)</p><br /><p><strong>Wir sind eine Menschheitsfamilie. • Wir sind eins. • Wir sind HUMAN CONNECTION</strong>❤️</p>",
          "id": "https://localhost:4123/activitypub/users/peter-lustig/status/p1",
          "published": "2019-02-24T00:23:12.556Z",
          "to": "https://www.w3.org/ns/activitystreams#Public",
          "type": "Article"
        },
        "type": "Create"
      }]
    }
    """

  Scenario: Send a request to the following URI of peter-lustig and expect a paginated following collection
    When I send a GET request to "/activitypub/users/peter-lustig/following?page=true"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/following?page=true",
      "summary": "peter-lustigs following collection",
      "type": "OrderedCollectionPage",
      "totalItems": 1,
      "partOf": "https://localhost:4123/activitypub/users/peter-lustig/following",
      "orderedItems": [
        "https://localhost:4123/activitypub/users/bob-der-bausmeister"
      ]
    }
    """

  Scenario: Send a request to the followers URI of peter-lustig and expect a paginated followers collection
    When I send a GET request to "/activitypub/users/peter-lustig/followers?page=true"
    Then I expect the status code to be 200
    And I receive the following json:
    """
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://localhost:4123/activitypub/users/peter-lustig/followers?page=true",
      "summary": "peter-lustigs followers collection",
      "type": "OrderedCollectionPage",
      "totalItems": 1,
      "partOf": "https://localhost:4123/activitypub/users/peter-lustig/followers",
      "orderedItems": [
        "https://localhost:4123/activitypub/users/bob-der-bausmeister"
      ]
    }
    """
