-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 11, 2019 at 11:42 PM
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

CREATE TABLE `categories` (
  `id` int(10) NOT NULL,
  `project` int(10) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

CREATE TABLE `components` (
  `id` int(10) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL,
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `components`
--

INSERT INTO `components` (`id`, `name`, `project`, `category`, `description`, `releaseID`, `priority`, `owner`) VALUES
(1, 'asda', 3, NULL, '', NULL, 'low', 'free_roaming94@yahoo.com');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(10) NOT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `wip` int(10) NOT NULL DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `startDate`, `wip`) VALUES
(3, 'Playground', '', '2019-02-10', 3);

-- --------------------------------------------------------

--
-- Table structure for table `releases`
--

CREATE TABLE `releases` (
  `id` int(10) NOT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(10) NOT NULL,
  `component` int(10) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `reporter` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `assignee` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `estimation` int(10) DEFAULT NULL,
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `lane` varchar(20) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `testSteps` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `expected` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `observed` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL,
  `blocked` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `component`, `name`, `description`, `startDate`, `dueDate`, `category`, `reporter`, `assignee`, `estimation`, `priority`, `lane`, `testSteps`, `expected`, `observed`, `project`, `releaseID`, `blocked`) VALUES
(1, 1, 'Raport', '', '2019-02-11', '2019-02-11', NULL, 'corciumihai@yahoo.com', 'free_roaming94@yahoo.com', 0, 'high', 'backlog', '', '', '', 3, NULL, 1),
(2, 1, 'asdasd', '', '2019-02-11', '2019-02-11', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'high', 'backlog', '', '', '', 3, NULL, NULL),
(3, 1, 'sad', '', '2019-02-11', '2019-02-11', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'high', 'backlog', '', '', '', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `report_comments`
--

CREATE TABLE `report_comments` (
  `id` int(10) NOT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `report` int(10) NOT NULL,
  `value` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci NOT NULL,
  `created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `report_worklogs`
--

CREATE TABLE `report_worklogs` (
  `id` int(10) NOT NULL,
  `comment` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `hours` int(10) DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `report` int(10) DEFAULT NULL,
  `created` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(10) NOT NULL,
  `component` int(10) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf32 COLLATE utf32_romanian_ci DEFAULT NULL,
  `description` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `category` int(10) DEFAULT NULL,
  `reporter` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `assignee` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `estimation` float DEFAULT '0',
  `priority` varchar(10) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `lane` varchar(15) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `project` int(10) DEFAULT NULL,
  `releaseID` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `component`, `name`, `description`, `startDate`, `dueDate`, `category`, `reporter`, `assignee`, `estimation`, `priority`, `lane`, `project`, `releaseID`) VALUES
(1, 1, 'asadad', '', '2019-02-11', '2019-02-11', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'backlog', 3, NULL),
(7, 1, 'asdad', '', '2019-02-11', '2019-02-11', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'backlog', 3, NULL),
(8, 1, 'asdad', '', '2019-02-11', '2019-02-12', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'backlog', 3, NULL),
(9, 1, 'asdasd', '', '2019-02-12', '2019-02-20', NULL, 'corciumihai@yahoo.com', 'corciumihai@yahoo.com', 0, 'low', 'backlog', 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tickets_worklogs`
--

CREATE TABLE `tickets_worklogs` (
  `id` int(10) NOT NULL,
  `comment` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `hours` int(10) DEFAULT '0',
  `ticket` int(10) DEFAULT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `created` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets_worklogs`
--

INSERT INTO `tickets_worklogs` (`id`, `comment`, `hours`, `ticket`, `owner`, `created`) VALUES
(1, '<p>asdad</p>', 2, 1, 'corciumihai@yahoo.com', '2019-02-11');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_comments`
--

CREATE TABLE `ticket_comments` (
  `id` int(10) NOT NULL,
  `owner` varchar(200) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `value` varchar(2000) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `ticket` int(10) DEFAULT NULL,
  `created` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ticket_comments`
--

INSERT INTO `ticket_comments` (`id`, `owner`, `value`, `ticket`, `created`) VALUES
(1, 'corciumihai@yahoo.com', '<p>asdad</p>', 1, '2019-02-11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(200) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `password` varchar(100) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_romanian_ci DEFAULT NULL,
  `company` varchar(150) CHARACTER SET utf32 COLLATE utf32_romanian_ci DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `role` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `name`, `company`, `isAdmin`, `role`) VALUES
('corciumihai@yahoo.com', '$2a$10$xbxf30wugGBFdy6kbVag6OvvlTqQYGr3M6yzJKfXFAdWaoMnpIfFC', 'Corciu Mihai', 'Facultatea de Informatică Iași', 0, 'Dezvoltator'),
('free_roaming94@yahoo.com', '$2a$10$IGy1fugc/W/Tj6LJ6eQD5uxnQ9IRh/hnd4vT0QXg598GlpQZ/98pC', 'Mihai Corciu', 'Administrație', 1, 'Administrator'),
('mobile_user@yahoo.com', '$2a$10$INKyp2xjZOoyu.yR8k6syec2FSUwv3CQXwas8xBYkLnvKJQKwh7Fq', 'Mobil', '', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `unique on name and project` (`project`,`name`);

--
-- Indexes for table `components`
--
ALTER TABLE `components`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `project_component_delete` (`project`),
  ADD KEY `category` (`category`),
  ADD KEY `release_null` (`releaseID`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `releases`
--
ALTER TABLE `releases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`,`project`) USING BTREE,
  ADD KEY `project` (`project`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `blocked` (`blocked`),
  ADD KEY `releaseID` (`releaseID`),
  ADD KEY `assignee` (`assignee`),
  ADD KEY `reporter` (`reporter`),
  ADD KEY `category` (`category`),
  ADD KEY `component` (`component`) USING BTREE;

--
-- Indexes for table `report_comments`
--
ALTER TABLE `report_comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_comments` (`id`),
  ADD KEY `owner` (`owner`),
  ADD KEY `report` (`report`);

--
-- Indexes for table `report_worklogs`
--
ALTER TABLE `report_worklogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_worklogs_id` (`id`),
  ADD KEY `owner` (`owner`),
  ADD KEY `report` (`report`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `releaseID` (`releaseID`),
  ADD KEY `assignee` (`assignee`),
  ADD KEY `reporter` (`reporter`),
  ADD KEY `category` (`category`),
  ADD KEY `component` (`component`) USING BTREE;

--
-- Indexes for table `tickets_worklogs`
--
ALTER TABLE `tickets_worklogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `ticket` (`ticket`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `ticket` (`ticket`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `components`
--
ALTER TABLE `components`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `releases`
--
ALTER TABLE `releases`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `report_comments`
--
ALTER TABLE `report_comments`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `report_worklogs`
--
ALTER TABLE `report_worklogs`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `tickets_worklogs`
--
ALTER TABLE `tickets_worklogs`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
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
  ADD CONSTRAINT `ticket_assignee_null` FOREIGN KEY (`assignee`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_comp_delete` FOREIGN KEY (`component`) REFERENCES `components` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_release_null` FOREIGN KEY (`releaseID`) REFERENCES `releases` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_reporter_null` FOREIGN KEY (`reporter`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tikcet_category_null` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
