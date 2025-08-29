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
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `CustomerId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `UserType` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  `NoOfBids` int DEFAULT NULL,
  `NoOfListings` int DEFAULT NULL,
  `currentOTP` int DEFAULT NULL,
  PRIMARY KEY (`CustomerId`)
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Customers Database';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (59,'Vamshi Krishna Kancharla','vamsikris.83@gmail.com','Sadashiva Heavens','Seller','Hyderabad','Telangana','India','$2b$05$q9q/E1F1XtWyq1VNlttIX.gacvEH4oUWfAU8EwvDfsQeyA66nBhQO','7306004129',NULL,1,248234),(60,'Linga Reddy','lingareddy.kancharla@gmail.com','Inupamula','Seller','Hyderabad','Telangana','India','$2b$05$q9q/E1F1XtWyq1VNlttIX.gacvEH4oUWfAU8EwvDfsQeyA66nBhQO','7306004128',NULL,NULL,NULL),(61,'Vamshi Krishna','vamshi.k.kancharla@gmail.com','Sadashiva Heavens','Customer','Hyderabad','Telangana','India','$2b$05$EhfbKy3kaKNuATZEhqDo3u.iSKG7Pq18ox8L7daUzHrw8rIMJZPtG','7306004127',NULL,NULL,874059),(62,'Hari Krishna Kancharla','hari.kancharla@gmail.com','Sadashiva Heavens','Customer','Hyderabad','Telangana','India','$2b$05$b3yFA7CesgNiQRXJW2YkFOhrUbAKAs9T.7q/LTXXpbOxHXVKlTaLG','9000001034',NULL,NULL,NULL),(63,'Pradeep Thammana','pradeep.thammana@gmail.com','Meenakshi Towers, Hitech City,','Builder','Hyderabad','Telangana','India','$2b$05$YVFJt9kFl5157VjSiGS1y.eeGAhaLQCOkZnLEkbnuP9WYMZkLVdZq','9849908935',NULL,NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
