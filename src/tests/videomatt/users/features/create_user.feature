Feature: Create User

  Scenario: Create a new user
    When I send a POST request to users with the following body:
      | name | email            | password |
      | John | john@example.com | password |
    Then I receive a response with status code 201