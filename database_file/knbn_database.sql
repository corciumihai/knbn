-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 18, 2018 at 07:46 PM
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
-- Table structure for table `avatars`
--

CREATE TABLE `avatars` (
  `email` varchar(32) NOT NULL,
  `image` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
('ID-1', 'Work on bug 1', 'Someone', 'SomeOtherDude', 'Project 2', '2018-02-12', 'progress', 'helllooo', '2018-02-12'),
('ID-2', 'Work on bug 2', 'Someone', 'SomeOtherDude', 'Project 4', '2018-02-12', 'doing', '12345', '2018-02-12'),
('ID-3', 'Work on bug 5', 'SomeOtherDude', 'Mihai Corciu', 'Project 5', '2018-02-12', 'backlog', 'bl', '2018-06-04'),
('ID-4', 'Work on bug 115', 'SomeOtherDude', 'Mihai Corciu', 'Project 5', '2018-02-15', 'backlog', 'dfsafasfsdfs', '2018-02-15'),
('ID-5', 'A new name', 'Someone', 'Mihai Corciu', 'Project 3', '2018-02-17', 'done', '', '2018-02-16');

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

CREATE TABLE `components` (
  `id` int(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `project` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `components`
--

INSERT INTO `components` (`id`, `name`, `project`) VALUES
(1, 'Component 1', 3),
(2, 'Component 2', 5),
(3, 'Component 3', 2);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`) VALUES
(1, 'Project 1'),
(2, 'Project 2'),
(3, 'Project 3'),
(4, 'Project 4'),
(5, 'Project Lol');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(32) NOT NULL COMMENT 'Users email',
  `password` varchar(60) DEFAULT NULL,
  `company` varchar(32) DEFAULT NULL,
  `name` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `company`, `name`) VALUES
('another@email.com', 'Hello1235', 'AnotherCompany', 'SomeOtherDude'),
('free_roaming94@yahoo.com', 'Hello1234', 'Conti', 'Mihai Corciu'),
('some@email.com', 'Hello1234', 'SomeCompany', 'Someone');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avatars`
--
ALTER TABLE `avatars`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`,`name`,`assignee`,`reporter`,`project`,`startDate`,`laneID`);

--
-- Indexes for table `components`
--
ALTER TABLE `components`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
