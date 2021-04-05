Feature: Super calculator operations
    This feature contains scenarios related to different calculator operations.

    Background: Pre-requisites
        Given User is on the Super calculator application web page.
    
    # Verify that the addition of numbers works correctly.
    Scenario: Addition of numbers

        When User input values as 13 and 12, selects "Addition" operation and clicks Go button.
        Then The result should be 25

    # Verify that the subtraction of numbers works correctly.
    Scenario: Subtraction of numbers

        When User input values as 13 and 12, selects "Subtraction" operation and clicks Go button.
        Then The result should be 1

    # Verify that the multiplication of numbers works correctly.
    Scenario: Multiplication of numbers

        When User input values as 13 and 12, selects "Multiplication" operation and clicks Go button.
        Then The result should be 1561

    # Verify that the division of numbers works correctly.
    Scenario: Division of numbers

        When User input values as 13 and 12, selects "Division" operation and clicks Go button.
        Then The result should be 1.0833333333333333

    # Verify that the modulo of numbers works correctly.
    Scenario: Modulo of numbers

        When User input values as 13 and 12, selects "Modulo" operation and clicks Go button.
        Then The result should be 1