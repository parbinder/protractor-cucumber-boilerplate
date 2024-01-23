DROP TABLE IF EXISTS FEATURE_SCENARIO_COUNT_OVER_TIME
DROP TABLE IF EXISTS AUTOMATED_MODULES
DROP TABLE IF EXISTS FEATURE_LIST
DROP TABLE IF EXISTS SCENARIO_LIST
DROP TABLE IF EXISTS EXECUTIONS
DROP TABLE IF EXISTS EXCEPTIONS
DROP TABLE IF EXISTS DEFECTS_RAISED_TO_JIRA
DROP TABLE IF EXISTS TAG_LIST
DROP TABLE IF EXISTS TAG_SCENARIO_LINKAGE

CREATE TABLE FEATURE_SCENARIO_COUNT_OVER_TIME (
	ID INT NOT NULL IDENTITY(1, 1),
	RECORD_TIME DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	MODULE INT NOT NULL,
	FEATURE_COUNT INT NOT NULL,
	SCENARIO_COUNT INT NOT NULL,
	PRIMARY KEY (ID));

CREATE TABLE AUTOMATED_MODULES (
	ID INT NOT NULL IDENTITY(1,1),
	MODULE_NAME NVARCHAR(50),
	ADDED_ON DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
)

CREATE TABLE FEATURE_LIST (
	ID INT NOT NULL IDENTITY(1,1),
	MODULE INT NOT NULL,
	FEATURE_NAME NVARCHAR(255),
	ADDED_ON DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	IS_DELETED BIT,
	PRIMARY KEY (ID)
)

CREATE TABLE SCENARIO_LIST (
	ID INT NOT NULL IDENTITY(1,1),
	FEATURE_ID INT NOT NULL,
	SCENARIO_NAME NVARCHAR(255),
	UPDATED_ON DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	IS_DELETED BIT,
	PRIMARY KEY (ID)
)

CREATE TABLE EXECUTIONS (
	ID INT NOT NULL IDENTITY(1,1),
	SCENARIO_ID INT NOT NULL,
	EXECUTION_STATUS NVARCHAR(255),
	ISSUES_LOGGED BIT,
	EXCEPTION_ENCOUNTERED BIT,
	EXECUTED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	HOSTNAME NVARCHAR(255),
	RETRY_ATTEMPT_INDEX INT NOT NULL DEFAULT 0,
	REQUEST_MACHINE NVARCHAR(50),
	REQUEST_MACHINE_USERNAME NVARCHAR(50),
	EXECUTION_GROUP_ID NVARCHAR(50)
	PRIMARY KEY (ID)
)

CREATE TABLE EXCEPTIONS (
	ID INT NOT NULL IDENTITY(1,1),
	EXECUTION_ID INT NOT NULL,
	EXCEPTION_TYPE NVARCHAR(255),
	EXCEPTION_CATEGORY NVARCHAR(255),
	RECORDED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
)

CREATE TABLE DEFECTS_RAISED_TO_JIRA(
	ID INT NOT NULL IDENTITY(1,1),
	EXECUTION_ID INT NOT NULL,
	SCENARIO_ID INT NOT NULL,
	JIRA_TICKET_ID NVARCHAR(255),
	RECORDED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
)

CREATE TABLE TAG_LIST (
	ID INT NOT NULL UNIQUE IDENTITY(1,1),
	TAG NVARCHAR(255) UNIQUE NOT NULL 
	)
CREATE TABLE TAG_SCENARIO_LINKAGE (
	ID INT NOT NULL IDENTITY(1,1),
	SCENARIO_ID INT NOT NULL,
	TAG_ID INT NOT NULL,
	)