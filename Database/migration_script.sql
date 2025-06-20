-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: smartauctiondb, world
-- Source Schemata: smartauctiondb, world
-- Created: Fri Jun 20 01:13:34 2025
-- Workbench Version: 8.0.42
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema smartauctiondb
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `smartauctiondb` ;
CREATE SCHEMA IF NOT EXISTS `smartauctiondb` ;

-- ----------------------------------------------------------------------------
-- Table smartauctiondb.assets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `smartauctiondb`.`assets` (
  `AssetId` INT NOT NULL AUTO_INCREMENT,
  `AssetType` VARCHAR(255) NULL DEFAULT NULL,
  `MinAuctionPrice` VARCHAR(255) NULL DEFAULT NULL,
  `Address` VARCHAR(255) NULL DEFAULT NULL,
  `Colony` VARCHAR(255) NULL DEFAULT NULL,
  `City` VARCHAR(255) NULL DEFAULT NULL,
  `State` VARCHAR(255) NULL DEFAULT NULL,
  `Country` VARCHAR(255) NULL DEFAULT NULL,
  `CurrentBidPrice` VARCHAR(255) NULL DEFAULT NULL,
  `BidderCustomerId` INT NULL DEFAULT NULL,
  `SellerCustomerId` INT NULL DEFAULT NULL,
  `ApprovalType` VARCHAR(255) NULL DEFAULT NULL,
  `AssetSize` VARCHAR(255) NULL DEFAULT NULL,
  `BuiltUpArea` VARCHAR(255) NULL DEFAULT NULL,
  `Status` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`AssetId`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table smartauctiondb.bids
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `smartauctiondb`.`bids` (
  `BidId` INT NOT NULL AUTO_INCREMENT,
  `AssetId` INT NULL DEFAULT NULL,
  `CustomerId` INT NULL DEFAULT NULL,
  `BidPrice` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`BidId`))
ENGINE = InnoDB
AUTO_INCREMENT = 67
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table smartauctiondb.customers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `smartauctiondb`.`customers` (
  `CustomerId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NULL DEFAULT NULL,
  `EmailAddress` VARCHAR(255) NULL DEFAULT NULL,
  `Address` VARCHAR(255) NULL DEFAULT NULL,
  `UserType` VARCHAR(255) NULL DEFAULT NULL,
  `City` VARCHAR(255) NULL DEFAULT NULL,
  `State` VARCHAR(255) NULL DEFAULT NULL,
  `Country` VARCHAR(255) NULL DEFAULT NULL,
  `Password` VARCHAR(255) NULL DEFAULT NULL,
  `PhoneNumber` VARCHAR(255) NULL DEFAULT NULL,
  `NoOfBids` INT NULL DEFAULT NULL,
  `NoOfListings` INT NULL DEFAULT NULL,
  PRIMARY KEY (`CustomerId`))
ENGINE = InnoDB
AUTO_INCREMENT = 59
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Customers Database';

-- ----------------------------------------------------------------------------
-- Table smartauctiondb.memberships
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `smartauctiondb`.`memberships` (
  `MembershipId` INT NOT NULL AUTO_INCREMENT,
  `CustomerId` INT NOT NULL,
  `MembershipType` VARCHAR(255) NOT NULL,
  `PaymentGateway` VARCHAR(255) NOT NULL,
  `PaymentType` VARCHAR(255) NOT NULL,
  `FeeAmount` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`MembershipId`),
  UNIQUE INDEX `CustomerId_UNIQUE` (`CustomerId` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Schema world
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `world` ;
CREATE SCHEMA IF NOT EXISTS `world` ;

-- ----------------------------------------------------------------------------
-- Table world.city
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `world`.`city` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` CHAR(35) NOT NULL DEFAULT '',
  `CountryCode` CHAR(3) NOT NULL DEFAULT '',
  `District` CHAR(20) NOT NULL DEFAULT '',
  `Population` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  INDEX `CountryCode` (`CountryCode` ASC) VISIBLE,
  CONSTRAINT `city_ibfk_1`
    FOREIGN KEY (`CountryCode`)
    REFERENCES `world`.`country` (`Code`))
ENGINE = InnoDB
AUTO_INCREMENT = 4080
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table world.country
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `world`.`country` (
  `Code` CHAR(3) NOT NULL DEFAULT '',
  `Name` CHAR(52) NOT NULL DEFAULT '',
  `Continent` ENUM('Asia', 'Europe', 'North America', 'Africa', 'Oceania', 'Antarctica', 'South America') NOT NULL DEFAULT 'Asia',
  `Region` CHAR(26) NOT NULL DEFAULT '',
  `SurfaceArea` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `IndepYear` SMALLINT NULL DEFAULT NULL,
  `Population` INT NOT NULL DEFAULT '0',
  `LifeExpectancy` DECIMAL(3,1) NULL DEFAULT NULL,
  `GNP` DECIMAL(10,2) NULL DEFAULT NULL,
  `GNPOld` DECIMAL(10,2) NULL DEFAULT NULL,
  `LocalName` CHAR(45) NOT NULL DEFAULT '',
  `GovernmentForm` CHAR(45) NOT NULL DEFAULT '',
  `HeadOfState` CHAR(60) NULL DEFAULT NULL,
  `Capital` INT NULL DEFAULT NULL,
  `Code2` CHAR(2) NOT NULL DEFAULT '',
  PRIMARY KEY (`Code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table world.countrylanguage
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `world`.`countrylanguage` (
  `CountryCode` CHAR(3) NOT NULL DEFAULT '',
  `Language` CHAR(30) NOT NULL DEFAULT '',
  `IsOfficial` ENUM('T', 'F') NOT NULL DEFAULT 'F',
  `Percentage` DECIMAL(4,1) NOT NULL DEFAULT '0.0',
  PRIMARY KEY (`CountryCode`, `Language`),
  INDEX `CountryCode` (`CountryCode` ASC) VISIBLE,
  CONSTRAINT `countryLanguage_ibfk_1`
    FOREIGN KEY (`CountryCode`)
    REFERENCES `world`.`country` (`Code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 1;
