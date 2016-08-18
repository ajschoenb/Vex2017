-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 18, 2016 at 07:20 AM
-- Server version: 10.1.10-MariaDB
-- PHP Version: 5.5.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vexscout2017`
--

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_num` int(255) NOT NULL,
  `team_num` int(255) NOT NULL,
  `tele_star_near` int(11) NOT NULL,
  `tele_star_far` int(11) NOT NULL,
  `tele_star_miss` int(11) NOT NULL,
  `tele_cube_near` int(11) NOT NULL,
  `tele_cube_far` int(11) NOT NULL,
  `tele_cube_miss` int(11) NOT NULL,
  `tele_low_hang` tinyint(11) NOT NULL,
  `tele_high_hang` tinyint(11) NOT NULL,
  `tele_hang_fail` tinyint(11) NOT NULL,
  `auto_star_near` int(11) NOT NULL,
  `auto_star_far` int(11) NOT NULL,
  `auto_star_miss` int(11) NOT NULL,
  `auto_cube_near` int(11) NOT NULL,
  `auto_cube_far` int(11) NOT NULL,
  `auto_cube_miss` int(11) NOT NULL,
  `auto_low_hang` tinyint(11) NOT NULL,
  `auto_high_hang` tinyint(11) NOT NULL,
  `auto_hang_fail` tinyint(11) NOT NULL,
  `driver_rating` int(11) NOT NULL,
  `contributed_score` int(11) NOT NULL,
  `auto_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`match_num`, `team_num`, `tele_star_near`, `tele_star_far`, `tele_star_miss`, `tele_cube_near`, `tele_cube_far`, `tele_cube_miss`, `tele_low_hang`, `tele_high_hang`, `tele_hang_fail`, `auto_star_near`, `auto_star_far`, `auto_star_miss`, `auto_cube_near`, `auto_cube_far`, `auto_cube_miss`, `auto_low_hang`, `auto_high_hang`, `auto_hang_fail`, `driver_rating`, `contributed_score`, `auto_score`) VALUES
(1, 118, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 50, 25);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_num` int(255) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `num_matches` int(11) NOT NULL,
  `avg_tele_star_near` decimal(11,3) NOT NULL,
  `avg_tele_star_far` decimal(11,3) NOT NULL,
  `avg_tele_star_miss` decimal(11,3) NOT NULL,
  `avg_tele_cube_near` decimal(11,3) NOT NULL,
  `avg_tele_cube_far` decimal(11,3) NOT NULL,
  `avg_tele_cube_miss` decimal(11,3) NOT NULL,
  `tot_tele_low_hang` decimal(11,3) NOT NULL,
  `tot_tele_high_hang` decimal(11,3) NOT NULL,
  `tot_tele_hang_fail` decimal(11,3) NOT NULL,
  `avg_auto_star_near` decimal(11,3) NOT NULL,
  `avg_auto_star_far` decimal(11,3) NOT NULL,
  `avg_auto_star_miss` decimal(11,3) NOT NULL,
  `avg_auto_cube_near` decimal(11,3) NOT NULL,
  `avg_auto_cube_far` decimal(11,3) NOT NULL,
  `avg_auto_cube_miss` decimal(11,3) NOT NULL,
  `tot_auto_low_hang` decimal(11,3) NOT NULL,
  `tot_auto_high_hang` decimal(11,3) NOT NULL,
  `tot_auto_hang_fail` decimal(11,3) NOT NULL,
  `avg_driver_rating` decimal(11,3) NOT NULL,
  `avg_contributed_score` decimal(11,3) NOT NULL,
  `avg_auto_score` decimal(11,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`team_num`, `team_name`, `num_matches`, `avg_tele_star_near`, `avg_tele_star_far`, `avg_tele_star_miss`, `avg_tele_cube_near`, `avg_tele_cube_far`, `avg_tele_cube_miss`, `tot_tele_low_hang`, `tot_tele_high_hang`, `tot_tele_hang_fail`, `avg_auto_star_near`, `avg_auto_star_far`, `avg_auto_star_miss`, `avg_auto_cube_near`, `avg_auto_cube_far`, `avg_auto_cube_miss`, `tot_auto_low_hang`, `tot_auto_high_hang`, `tot_auto_hang_fail`, `avg_driver_rating`, `avg_contributed_score`, `avg_auto_score`) VALUES
(118, 'Robonauts', 1, '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '1.000', '50.000', '25.000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`team_num`,`match_num`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_num`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
