-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 14, 2019 at 05:58 AM
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
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `val` varchar(1000) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `author` varchar(200) NOT NULL,
  `created` bigint(20) NOT NULL,
  `lastModified` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `val`, `ticketId`, `author`, `created`, `lastModified`) VALUES
(2, 'random commentasd', 2, '1', 1529252603490, 1529253520722),
(3, 'sadad', 2, '1', 1529863355202, 1529863355202);

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

CREATE TABLE `components` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `project` int(11) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `startDate` varchar(255) DEFAULT NULL,
  `releaseID` int(11) DEFAULT NULL,
  `priority` varchar(11) DEFAULT NULL,
  `owner` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `components`
--

INSERT INTO `components` (`id`, `name`, `project`, `category`, `description`, `startDate`, `releaseID`, `priority`, `owner`) VALUES
(7, 'Componentă #2', 4, NULL, '<p>O descriere a <strong>componentei</strong></p>', '1547322401530', 32, 'high', 'mobile.user@yahoo.com');

-- --------------------------------------------------------

--
-- Table structure for table `components_comments`
--

CREATE TABLE `components_comments` (
  `id` int(200) NOT NULL,
  `author` varchar(200) NOT NULL,
  `created` varchar(200) NOT NULL,
  `value` varchar(2000) NOT NULL,
  `compID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `components_comments`
--

INSERT INTO `components_comments` (`id`, `author`, `created`, `value`, `compID`) VALUES
(73, 'free_roaming94@yahoo.com', '1547144146505', '<p><strong>Another </strong>one.</p>', 1),
(74, 'free_roaming94@yahoo.com', '1547144279595', '<p>Yay</p>', 1),
(75, '', '1547395017498', '<p>asdasd</p>', 7);

-- --------------------------------------------------------

--
-- Table structure for table `disciplines`
--

CREATE TABLE `disciplines` (
  `id` int(11) NOT NULL,
  `project` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `disciplines`
--

INSERT INTO `disciplines` (`id`, `project`, `name`) VALUES
(13, '1', 'Software'),
(14, '1', 'Hardware'),
(15, '1', 'System Testing');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `startDate` int(255) DEFAULT NULL,
  `description` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `startDate`, `description`) VALUES
(4, 'First project', 2147483647, ''),
(10, 'Second Project', 2147483647, '');

-- --------------------------------------------------------

--
-- Table structure for table `prs`
--

CREATE TABLE `prs` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `component` int(11) NOT NULL,
  `assignee` varchar(200) NOT NULL,
  `blockedTicket` int(11) NOT NULL,
  `blockingTicket` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `estimation` int(10) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `priority` int(11) NOT NULL,
  `releaseID` int(11) NOT NULL,
  `dueDate` varchar(200) NOT NULL,
  `testSteps` varchar(2000) NOT NULL,
  `observedBehavior` varchar(2000) NOT NULL,
  `expectedBehavior` varchar(2000) NOT NULL,
  `startDate` varchar(200) NOT NULL,
  `lane` varchar(20) NOT NULL,
  `reporter` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `prs`
--

INSERT INTO `prs` (`id`, `name`, `component`, `assignee`, `blockedTicket`, `blockingTicket`, `category`, `estimation`, `description`, `priority`, `releaseID`, `dueDate`, `testSteps`, `observedBehavior`, `expectedBehavior`, `startDate`, `lane`, `reporter`) VALUES
(2, 'New PR', 1, 'free_roaming94@yahoo.com', 7, 0, 13, 0, '<p>A new PR.</p>', 0, 29, '1547136518841', '<ol><li>Some bullshit</li></ol>', '<ol><li>Not the bullshit I want</li></ol>', '<ol><li>Other bullshit</li></ol>', '1547136518841', 'backlog', ''),
(3, 'Second PR', 3, 'mobile.user@yahoo.com', 0, 0, 13, 0, '<p>Second <strong>PR</strong></p>', 0, 32, '1547142485832', '', '', '', '1547142485832', 'backlog', '');

-- --------------------------------------------------------

--
-- Table structure for table `releases`
--

CREATE TABLE `releases` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `project` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `releases`
--

INSERT INTO `releases` (`id`, `name`, `project`, `startDate`, `endDate`) VALUES
(29, 'Release 001', '1', '1529755845619', '1529755845619'),
(32, 'Release 002', '1', '1529765874043', '1529765874043'),
(33, 'Release 003', '1', '1529701200000', '1529701200000');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `component` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `dueDate` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `discipline` int(11) DEFAULT NULL,
  `reporter` varchar(255) NOT NULL,
  `assignee` varchar(255) NOT NULL,
  `blocked` int(11) DEFAULT NULL,
  `blocking` int(11) DEFAULT NULL,
  `estimation` int(11) UNSIGNED DEFAULT NULL,
  `steps` varchar(255) DEFAULT NULL,
  `observedBehaviour` varchar(255) DEFAULT NULL,
  `expectedBehaviour` varchar(255) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `lane` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `component`, `name`, `description`, `dueDate`, `startDate`, `discipline`, `reporter`, `assignee`, `blocked`, `blocking`, `estimation`, `steps`, `observedBehaviour`, `expectedBehaviour`, `priority`, `lane`) VALUES
(1, 0, 'sadasd', '', '1527368400000', '1527368400000', 0, 'another@email.com', 'random6.email@email.com', 0, 0, 0, 'asdasd', 'asdasd', 'adsad', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `component` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `dueDate` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `reporter` varchar(255) DEFAULT NULL,
  `assignee` varchar(255) DEFAULT NULL,
  `blockedTicket` int(10) UNSIGNED DEFAULT NULL,
  `blockingTicket` int(10) UNSIGNED DEFAULT NULL,
  `estimation` int(10) UNSIGNED NOT NULL,
  `lane` varchar(20) NOT NULL,
  `priority` varchar(10) DEFAULT NULL,
  `releaseID` int(11) NOT NULL,
  `project` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `component`, `name`, `description`, `dueDate`, `startDate`, `category`, `reporter`, `assignee`, `blockedTicket`, `blockingTicket`, `estimation`, `lane`, `priority`, `releaseID`, `project`) VALUES
(19, 7, 'Tichet #2', '<p>Descriere generica</p>', '1547325816492', '1547325816492', NULL, 'free_roaming94@yahoo.com', 'mobile.user@yahoo.com', NULL, NULL, 0, 'backlog', 'high', 32, 4);

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
('free_roaming94@yahoo.com', '$2a$08$SvUCBWmJrfs7hJNgglrTxuq3BimCmYoS8kUgzvWjOZfeMy2gyLIiS', 'CompanyX', 'Mihai Corciu'),
('mobile.user@yahoo.com', '$2a$08$TlEqk6xqBDDvbAeSd0OVTOpjtowskcRKfBcqneca0kB1rs8AURuMm', 'Mobile Company', 'Mobile User');

-- --------------------------------------------------------

--
-- Table structure for table `worklogs`
--

CREATE TABLE `worklogs` (
  `id` int(11) NOT NULL,
  `val` varchar(1000) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `author` int(11) NOT NULL,
  `created` bigint(20) NOT NULL,
  `lastModified` bigint(20) NOT NULL,
  `hours` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `worklogs`
--

INSERT INTO `worklogs` (`id`, `val`, `ticketId`, `author`, `created`, `lastModified`, `hours`) VALUES
(3, 'Hello', 1, 1, 1529753505588, 1529753505588, 12),
(4, 'adasd', 2, 1, 1529863706863, 1529863706863, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avatars`
--
ALTER TABLE `avatars`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `components`
--
ALTER TABLE `components`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `components_comments`
--
ALTER TABLE `components_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `disciplines`
--
ALTER TABLE `disciplines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `prs`
--
ALTER TABLE `prs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `releases`
--
ALTER TABLE `releases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `worklogs`
--
ALTER TABLE `worklogs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `components`
--
ALTER TABLE `components`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `components_comments`
--
ALTER TABLE `components_comments`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;
--
-- AUTO_INCREMENT for table `disciplines`
--
ALTER TABLE `disciplines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `prs`
--
ALTER TABLE `prs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `releases`
--
ALTER TABLE `releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `worklogs`
--
ALTER TABLE `worklogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
