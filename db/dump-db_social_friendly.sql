/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: db_social_friendly
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sf_tc_gender`
--

DROP TABLE IF EXISTS `sf_tc_gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tc_gender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tc_gender`
--

LOCK TABLES `sf_tc_gender` WRITE;
/*!40000 ALTER TABLE `sf_tc_gender` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tc_gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tc_interest`
--

DROP TABLE IF EXISTS `sf_tc_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tc_interest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `interest_type` varchar(50) DEFAULT NULL,
  `interest_name` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tc_interest`
--

LOCK TABLES `sf_tc_interest` WRITE;
/*!40000 ALTER TABLE `sf_tc_interest` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tc_interest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_conversation`
--

DROP TABLE IF EXISTS `sf_tr_conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `participant1_id` int(11) DEFAULT NULL,
  `participant2_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sf_tr_conversation_sf_tr_user_FK` (`participant1_id`),
  KEY `sf_tr_conversation_sf_tr_user_FK_1` (`participant2_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_conversation`
--

LOCK TABLES `sf_tr_conversation` WRITE;
/*!40000 ALTER TABLE `sf_tr_conversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_conversation_message`
--

DROP TABLE IF EXISTS `sf_tr_conversation_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_conversation_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sf_tr_conversation_message_sf_tr_messages_FK` (`message_id`),
  KEY `sf_tr_conversation_message_sf_tr_conversation_FK` (`conversation_id`),
  CONSTRAINT `sf_tr_conversation_message_sf_tr_conversation_FK` FOREIGN KEY (`conversation_id`) REFERENCES `sf_tr_conversation` (`id`),
  CONSTRAINT `sf_tr_conversation_message_sf_tr_messages_FK` FOREIGN KEY (`message_id`) REFERENCES `sf_tr_messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_conversation_message`
--

LOCK TABLES `sf_tr_conversation_message` WRITE;
/*!40000 ALTER TABLE `sf_tr_conversation_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_conversation_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_messages`
--

DROP TABLE IF EXISTS `sf_tr_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_text` text DEFAULT NULL,
  `send_at` timestamp NULL DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_messages`
--

LOCK TABLES `sf_tr_messages` WRITE;
/*!40000 ALTER TABLE `sf_tr_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_profile`
--

DROP TABLE IF EXISTS `sf_tr_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `date_of_birthday` date NOT NULL,
  `id_gender` int(11) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `sf_tr_profile_sf_tc_gender_FK` (`id_gender`),
  KEY `sf_tr_profile_sf_tr_user_FK` (`id_user`),
  CONSTRAINT `sf_tr_profile_sf_tc_gender_FK` FOREIGN KEY (`id_gender`) REFERENCES `sf_tc_gender` (`id`),
  CONSTRAINT `sf_tr_profile_sf_tr_user_FK` FOREIGN KEY (`id_user`) REFERENCES `sf_tr_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_profile`
--

LOCK TABLES `sf_tr_profile` WRITE;
/*!40000 ALTER TABLE `sf_tr_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_user`
--

DROP TABLE IF EXISTS `sf_tr_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(60) NOT NULL,
  `username` varchar(250) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_user`
--

LOCK TABLES `sf_tr_user` WRITE;
/*!40000 ALTER TABLE `sf_tr_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sf_tr_user_interest`
--

DROP TABLE IF EXISTS `sf_tr_user_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sf_tr_user_interest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `interest_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `sf_tr_user_interest_sf_tc_interest_FK` (`interest_id`),
  KEY `sf_tr_user_interest_sf_tr_user_FK` (`user_id`),
  CONSTRAINT `sf_tr_user_interest_sf_tc_interest_FK` FOREIGN KEY (`interest_id`) REFERENCES `sf_tc_interest` (`id`),
  CONSTRAINT `sf_tr_user_interest_sf_tr_user_FK` FOREIGN KEY (`user_id`) REFERENCES `sf_tr_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sf_tr_user_interest`
--

LOCK TABLES `sf_tr_user_interest` WRITE;
/*!40000 ALTER TABLE `sf_tr_user_interest` DISABLE KEYS */;
/*!40000 ALTER TABLE `sf_tr_user_interest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-25 18:12:56
