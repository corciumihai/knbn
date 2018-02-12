-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2018 at 10:35 PM
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
-- Database: `knbn_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `assignee` varchar(32) NOT NULL,
  `reporter` varchar(32) NOT NULL,
  `project` varchar(32) NOT NULL,
  `startDate` date NOT NULL,
  `laneID` varchar(20) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `endDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cards`
--

INSERT INTO `cards` (`id`, `name`, `assignee`, `reporter`, `project`, `startDate`, `laneID`, `description`, `endDate`) VALUES
('ID-1', 'Work on bug 1', 'Someone', 'SomeOtherDude', 'Project 2', '2018-02-12', 'backlog', 'helllooo', '2018-02-12'),
('ID-2', 'Work on bug 2', 'Someone', 'SomeOtherDude', 'Project 4', '2018-02-12', 'backlog', '12345', '2018-02-12'),
('ID-3', 'Work on bug 5', 'SomeOtherDude', 'Mihai Corciu', 'Project 5', '2018-02-12', 'progress', 'bl', '2018-06-04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`,`name`,`assignee`,`reporter`,`project`,`startDate`,`laneID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
