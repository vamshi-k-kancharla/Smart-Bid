-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: smartauctiondb
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `AssetId` int NOT NULL AUTO_INCREMENT,
  `AssetType` varchar(255) DEFAULT NULL,
  `MinAuctionPrice` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Colony` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `CurrentBidPrice` varchar(255) DEFAULT NULL,
  `BidderCustomerId` int DEFAULT NULL,
  `SellerCustomerId` int DEFAULT NULL,
  `ApprovalType` varchar(255) DEFAULT NULL,
  `AssetSize` varchar(255) DEFAULT NULL,
  `BuiltUpArea` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `AssetBedrooms` varchar(255) DEFAULT NULL,
  `AssetBathrooms` varchar(255) DEFAULT NULL,
  `AssetDescription` varchar(255) DEFAULT NULL,
  `NoOfFiles` int DEFAULT NULL,
  `BiddingType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`AssetId`)
) ENGINE=InnoDB AUTO_INCREMENT=608 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (13,'Flat','4000000','godrej royal woods','devanahalli','bangalore','karnataka','india','4600000',60,63,'bda','20 sq yards','450 sqft','open',NULL,NULL,'New Description',3,'open'),(14,'Flat','4000000','Godrej Royal Woods','Devanahalli','Hyderabad','Telangana','India','4600000',59,60,'BDA','20 Sq Yards','450 SQFT','open',NULL,NULL,'New Description',2,'secretive'),(15,'Flat','7500000','Devanahalli','bhuvanahalli','Bangalore','Karnataka','India','8000000',63,60,'BDA','35 Sq Yards','950 SFT','Open',NULL,NULL,'New Description',1,'open'),(16,'Villa','20000000','Sadashiva Heavens','Pedda Amberpet','Hyderabad','Telangana','India','21000001',61,59,'HMDA','200 Sq Yards','3000 Sqft','open',NULL,NULL,'New Description',1,'secretive'),(17,'Villa','22500000','Sadashiva Heavens','PeddaAmberpet','Hyderabad','Telangana','India','25000000',59,59,'HMDA','200 Sq yards','3500 Sqft','open',NULL,NULL,'New Description',4,'open'),(18,'Villa','22300000','Sadashiva Heavens','PeddaAmberpet','Hyderabad','Telangana','India','22300000',60,59,'HMDA','200 Sq yards','3600 Sqft','open','undefined','undefined','New Description',1,'secretive'),(19,'Villa','2250000','Sadashiva Heavens','PeddaAmberpet','Hyderabad','Telangana','India','2250000',61,59,'HMDA','200 Sq yards','3500 Sqft','open','undefined','undefined','New Description',1,'open'),(20,'Plot','20000000','Sadashiva Heavens','PeddaAmberpet','Hyderabad','Telangana','India','20000000',61,59,'HMDA','200 Sq yards','3500 Sqft','open','4','2','New Description',1,'secretive'),(21,'Land','6000000','Gagan Vihar','Adibatla','Hyderabad','Telangana','India','6000000',61,59,'HMDA','200 Sq yards','3600 Sqft','open','3','3','New Description changed',2,'open'),(22,'Villa','600000','Gagan Vihar','Adibatla','Hyderabad','Telangana','India','600000',60,59,'HMDA','200 Sq yards','3700 Sqft','open','3','2','New Description',1,'secretive'),(23,'Villa','2250000','Sadashiva Heavens','PeddaAmberpet','Hyderabad','Telangana','India','2250000',61,59,'HMDA','200 Sq yards','3600 Sqft','open','4','3','Another villa for sale.',1,'open'),(24,'Flat','4000000','Krish Arena, Masjid Banda','Kondapur','Hyderabad','Telangana','India','4500000',59,63,'GHMC','50 sq yards','450 SQFT','open','4','3','Beautiful flat in Krish Arena',3,NULL),(25,'Villa','35000000','Krish Arena, Masjid Banda','Kondapur','Hyderabad','Telangana','India','35000000',NULL,63,'GHMC','150 sq yards','450 SQFT','Open','4','3','Beautiful flat in Kondapur for sale.',1,NULL),(26,'Villa','25000000','Rajpushpa Atria','Osman Nagar','Hyderabad','Telangana','India','28500000',59,63,'HDMA','200 Sq Yards','2500 Sqft','Open','5','4','Beautiful Villa in Raj Pushpa Atria',1,NULL),(27,'Villa','25000000','Rajpushpa Atria','Osman Nagar','Hyderabad','Telangana','India','28000000',59,63,'HDMA','200 Sq Yards','3500 Sqft','Open','4','3','Beautiful Villa in Osman Nagar open for Auction.',1,'secretive'),(28,'Villa','25000000','Rajpushpa Atria','Osman Nagar','Hyderabad','Telangana','India','25000000',NULL,59,'HDMA','250 Sq Yards','3500 Sqft','Open','4','3','Villa in Osman Nagar',1,'open'),(29,'Villa','25000000','Rajpushpa Atria','Osman Nagar','Hyderabad','Telangana','India','25000000',NULL,59,'HDMA','250 Sq Yards','3800 Sqft','Open','4','4','Beautiful villa in Osman Nagar.',1,'secretive'),(607,'Villa','30000000','Aparna Shangri La','nanakramguda','hyderabad','Telangana','India','30000000',NULL,59,'HMDA','350 Sq Yards','4000 Sqft','Open','5','3','New villa in Aparna Shangri La in Nanakramguda.',10,'open');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-30  5:16:29
