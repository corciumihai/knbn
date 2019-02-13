-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 13, 2019 at 01:41 AM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `knbn`
--
CREATE DATABASE IF NOT EXISTS `knbn` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `knbn`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `project` int(10) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `unique on name and project` (`project`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `project`, `name`) VALUES
(3, 4, 'Altele'),
(4, 4, 'Arhitectură'),
(2, 4, 'Hardware'),
(1, 4, 'Software');

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
CREATE TABLE IF NOT EXISTS `components` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL,
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `project_component_delete` (`project`),
  KEY `category` (`category`),
  KEY `release_null` (`releaseID`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `components`
--

INSERT INTO `components` (`id`, `name`, `project`, `category`, `description`, `releaseID`, `priority`, `owner`) VALUES
(1, 'asda', 3, NULL, '', NULL, 'low', 'free_roaming94@yahoo.com'),
(2, 'Securitatea aplicației', 4, 1, '<p>Implementarea securității totale a aplicației</p>', 1, 'high', 'corciumihai@yahoo.com'),
(3, 'Arhitectură', 4, 4, '<p>Definește arhitectura unui proiect.</p>', 6, 'low', 'free_roaming94@yahoo.com'),
(4, 'Bază de date', 4, 1, '<p>Configurează baza de date</p>', 6, 'low', 'free_roaming94@yahoo.com'),
(5, 'Server', 4, 1, '<p>Implementarea serverului</p>', 5, 'low', 'corciumihai@yahoo.com'),
(6, 'Client ReactJS', 4, 1, '<p>Implementarea clientului bazată pe tehnologia ReactJS</p>', 1, 'low', 'corciumihai@yahoo.com');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `wip` int(10) NOT NULL DEFAULT '3',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `startDate`, `wip`) VALUES
(3, 'Playground', '', '2019-02-10', 3),
(4, 'KBNB - Principiile metodologiei kanban în format electronic', '<p>Proiectul de licență propus de Mihai Corciu, coordonator științific de Lector, Dr. Cristian Traian Vidrașcu.</p>', '2019-02-12', 2);

-- --------------------------------------------------------

--
-- Table structure for table `releases`
--

DROP TABLE IF EXISTS `releases`;
CREATE TABLE IF NOT EXISTS `releases` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`,`project`) USING BTREE,
  KEY `project` (`project`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `releases`
--

INSERT INTO `releases` (`id`, `name`, `project`) VALUES
(7, 'sada', 4),
(6, 'v.0.0.1', 4),
(5, 'v.0.0.2', 4),
(1, 'v.1.0.0', 4),
(4, 'v.1.0.1', 4);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `component` int(10) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `reporter` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `assignee` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `estimation` int(10) DEFAULT NULL,
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT 'high',
  `lane` varchar(20) CHARACTER SET ascii COLLATE ascii_bin DEFAULT 'backlog',
  `testSteps` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `expected` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `observed` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL,
  `blocked` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `blocked` (`blocked`),
  KEY `releaseID` (`releaseID`),
  KEY `assignee` (`assignee`),
  KEY `reporter` (`reporter`),
  KEY `category` (`category`),
  KEY `component` (`component`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `component`, `name`, `description`, `startDate`, `dueDate`, `category`, `reporter`, `assignee`, `estimation`, `priority`, `lane`, `testSteps`, `expected`, `observed`, `project`, `releaseID`, `blocked`) VALUES
(5, 1, 'Test 2', '', '2019-02-12', '2019-02-28', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'in_progress', '', '', '', 3, NULL, NULL),
(6, 1, 'Test 1', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'backlog', '', '', '', 3, NULL, NULL),
(10, 4, 'Zilele limită nu pot fi salvate', '<p>Baza de date returnează eroare când se încearcă inserarea zilei limită</p>', '2019-02-12', '2019-03-06', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 5, 'high', 'done', '<ol><li>Creare un tichet nou</li><li>Eroare apare</li></ol>', '<p>Să nu fie eroare</p>', '<p>Mesaj de eroare în pagină</p>', 4, 1, NULL),
(11, 6, 'Mesajele de succes nu apar', '', '2019-02-13', '2019-02-13', NULL, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 0, 'high', 'done', '', '', '', 4, NULL, 37);

-- --------------------------------------------------------

--
-- Table structure for table `report_comments`
--

DROP TABLE IF EXISTS `report_comments`;
CREATE TABLE IF NOT EXISTS `report_comments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `report` int(10) NOT NULL,
  `value` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci NOT NULL,
  `created` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_comments` (`id`),
  KEY `owner` (`owner`),
  KEY `report` (`report`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `report_worklogs`
--

DROP TABLE IF EXISTS `report_worklogs`;
CREATE TABLE IF NOT EXISTS `report_worklogs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `comment` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `hours` int(10) DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `report` int(10) DEFAULT NULL,
  `created` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_worklogs_id` (`id`),
  KEY `owner` (`owner`),
  KEY `report` (`report`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `report_worklogs`
--

INSERT INTO `report_worklogs` (`id`, `comment`, `hours`, `owner`, `report`, `created`) VALUES
(1, '<p>Toate datele calendaristice sunt supuse conversiei acum</p>', 2, 'free_roaming94@yahoo.com', 10, '2019-02-12');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `component` int(10) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf32 COLLATE utf32_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `reporter` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `assignee` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `estimation` float DEFAULT '0',
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT 'low',
  `lane` varchar(15) CHARACTER SET ascii COLLATE ascii_bin DEFAULT 'backlog',
  `project` int(10) DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `releaseID` (`releaseID`),
  KEY `assignee` (`assignee`),
  KEY `reporter` (`reporter`),
  KEY `category` (`category`),
  KEY `component` (`component`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `component`, `name`, `description`, `startDate`, `dueDate`, `category`, `reporter`, `assignee`, `estimation`, `priority`, `lane`, `project`, `releaseID`) VALUES
(16, 2, 'Generează certificatul SSL', '<p>Genereaza certificatele Secure Socket Layer</p>', '2019-02-12', '2019-02-14', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 2, 'medium', 'closed', 4, 6),
(17, 2, 'Instalează biblioteca bCrypt', '<p>Parolele utilizatorilor vor fi criptate cu ajutorul acestei biblioteci.</p>', '2019-02-12', '2019-02-14', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 20, 'high', 'closed', 4, 5),
(22, 2, 'Configurează mecanismul de autentificare JWT', '<p>Instalează biblioteca JSON Web Token</p>', '2019-02-12', '2019-03-01', 1, 'mobile_user@yahoo.com', 'corciumihai@yahoo.com', 15, 'medium', 'done', 4, 1),
(23, 3, 'Arhitectură proiect', '<p>Creează arhitectura unui proiect/tabelă.</p>', '2019-02-12', '2019-03-01', 4, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 20, 'high', 'closed', 4, 6),
(24, 3, 'Arhitectură modul', '<p>Creeză arhitectura unui module/coloane.</p>', '2019-02-12', '2019-03-01', 4, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 10, 'low', 'done', 4, 6),
(25, 3, 'Arhitectură tichet', '<p>Descrierea arhitecturii unui modul</p>', '2019-02-12', '2019-03-06', 4, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 5, 'medium', 'in_progress', 4, 6),
(26, 3, 'Arhitectură raport problemă', '<p>Descrie arhitectura unui raport problemă</p>', '2019-02-12', '2019-03-05', 4, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 5, 'low', 'closed', 4, 6),
(27, 4, 'Configureaza tabelul Utilizatorilor', '', '2019-02-12', '2019-03-07', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 1, 'high', 'closed', 4, 6),
(28, 5, 'Crează ruta și mecanism autentificare', '', '2019-02-12', '2019-02-12', 1, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'in_progress', 4, 5),
(29, 5, 'Implementează ruta de înregistrare', '', '2019-02-12', '2019-02-12', 1, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'done', 4, 5),
(30, 5, 'Implementeă ruta de deconectare', '', '2019-02-12', '2019-02-12', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'done', 4, 5),
(31, 6, 'Pagină de creare Proiect', '', '2019-02-12', '2019-03-03', 1, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'low', 'in_progress', 4, 5),
(32, 6, 'Pagină de create Modul', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'backlog', 4, NULL),
(33, 6, 'Pagină de creare Tichet', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'done', 4, NULL),
(34, 6, 'Pagină de creare Raport problemă', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'medium', 'backlog', 4, NULL),
(35, 6, 'Pagină de editare Proiect', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'in_progress', 4, NULL),
(36, 6, 'Pagină de editare Modul', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 0, 'low', 'in_progress', 4, NULL),
(37, 6, 'Pagină de editare Tichet', '', '2019-02-12', '2019-02-12', NULL, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 2, 'low', 'backlog', 4, NULL),
(38, 6, 'Pagină de editare Raport problemă', '', '2019-02-13', '2019-02-12', 1, 'free_roaming94@yahoo.com', 'corciumihai@yahoo.com', 2, 'medium', 'closed', 4, 6),
(39, 6, 'Mecanism eliminare elemente', '', '2019-02-13', '2019-02-13', 1, 'free_roaming94@yahoo.com', 'free_roaming94@yahoo.com', 2, 'medium', 'backlog', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tickets_worklogs`
--

DROP TABLE IF EXISTS `tickets_worklogs`;
CREATE TABLE IF NOT EXISTS `tickets_worklogs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `comment` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `hours` int(10) DEFAULT '0',
  `ticket` int(10) DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `created` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `ticket` (`ticket`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets_worklogs`
--

INSERT INTO `tickets_worklogs` (`id`, `comment`, `hours`, `ticket`, `owner`, `created`) VALUES
(1, '<p>Certificate generate și instalate.</p>', 2, 16, 'free_roaming94@yahoo.com', '2019-02-12'),
(2, '<p>bCrypt up-and-running</p>', 15, 17, 'free_roaming94@yahoo.com', '2019-02-12'),
(3, '<p>JWT este configurat pe server.</p>', 3, 22, 'free_roaming94@yahoo.com', '2019-02-12'),
(4, '<p>Tabel creat</p>', 1, 27, 'free_roaming94@yahoo.com', '2019-02-12');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_comments`
--

DROP TABLE IF EXISTS `ticket_comments`;
CREATE TABLE IF NOT EXISTS `ticket_comments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `value` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `ticket` int(10) DEFAULT NULL,
  `created` date DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ticket` (`ticket`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(200) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `password` varchar(100) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `company` varchar(150) CHARACTER SET utf32 COLLATE utf32_romanian_ci DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `role` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `name`, `company`, `isAdmin`, `role`) VALUES
('corciumihai@yahoo.com', '$2a$10$xbxf30wugGBFdy6kbVag6OvvlTqQYGr3M6yzJKfXFAdWaoMnpIfFC', 'Corciu Mihai', 'Facultatea de Informatică Iași', 0, 'Dezvoltator'),
('free_roaming94@yahoo.com', '$2a$10$IGy1fugc/W/Tj6LJ6eQD5uxnQ9IRh/hnd4vT0QXg598GlpQZ/98pC', 'Mihai Corciu', 'Administrație', 1, 'Administrator'),
('mobile_user@yahoo.com', '$2a$10$INKyp2xjZOoyu.yR8k6syec2FSUwv3CQXwas8xBYkLnvKJQKwh7Fq', 'Mobil', '', 0, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `FR` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delete_on_project_delete` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `components`
--
ALTER TABLE `components`
  ADD CONSTRAINT `category_null` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_component_delete` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `release_null` FOREIGN KEY (`releaseID`) REFERENCES `releases` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_delete` FOREIGN KEY (`owner`) REFERENCES `users` (`email`) ON DELETE SET NULL;

--
-- Constraints for table `releases`
--
ALTER TABLE `releases`
  ADD CONSTRAINT `rel_project_delete` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `blocked_fk` FOREIGN KEY (`blocked`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `re_reporter_null` FOREIGN KEY (`reporter`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `release_null_rep` FOREIGN KEY (`releaseID`) REFERENCES `releases` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rep_assignee_null` FOREIGN KEY (`assignee`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_category_cull` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_comp_delete` FOREIGN KEY (`component`) REFERENCES `components` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report_comments`
--
ALTER TABLE `report_comments`
  ADD CONSTRAINT `report_comm_delete_on_report` FOREIGN KEY (`report`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `report_comm_delete_on_user` FOREIGN KEY (`owner`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `report_worklogs`
--
ALTER TABLE `report_worklogs`
  ADD CONSTRAINT `report_work_delete_on_user` FOREIGN KEY (`owner`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_work_on_report_delete` FOREIGN KEY (`report`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `ticket_assignee_null` FOREIGN KEY (`assignee`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `ticket_comp_delete` FOREIGN KEY (`component`) REFERENCES `components` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `ticket_release_null` FOREIGN KEY (`releaseID`) REFERENCES `releases` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `ticket_reporter_null` FOREIGN KEY (`reporter`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `tikcet_category_null` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `tickets_worklogs`
--
ALTER TABLE `tickets_worklogs`
  ADD CONSTRAINT `ticket_work_delete` FOREIGN KEY (`ticket`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_work_delete` FOREIGN KEY (`owner`) REFERENCES `users` (`email`) ON DELETE SET NULL;

--
-- Constraints for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD CONSTRAINT `comments_user_delete` FOREIGN KEY (`owner`) REFERENCES `users` (`email`) ON DELETE SET NULL,
  ADD CONSTRAINT `ticket_delete_comm` FOREIGN KEY (`ticket`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
