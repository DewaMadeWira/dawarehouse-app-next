-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 13, 2023 at 04:04 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `incoming_item_table`
--

CREATE TABLE `incoming_item_table` (
  `incoming_item_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `incoming_item_quantity` int(11) NOT NULL,
  `incoming_item_date` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incoming_item_table`
--

INSERT INTO `incoming_item_table` (`incoming_item_id`, `warehouse_id`, `incoming_item_quantity`, `incoming_item_date`) VALUES
(1, 1, 90, '2023-08-13 02:01:04.583'),
(2, 2, 15, '2023-08-13 02:01:23.383'),
(3, 3, 4, '2023-08-13 02:01:42.871'),
(4, 4, 20, '2023-08-13 02:01:59.643'),
(5, 5, 25, '2023-08-13 02:03:31.833');

-- --------------------------------------------------------

--
-- Table structure for table `item_table`
--

CREATE TABLE `item_table` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_category` varchar(30) NOT NULL,
  `item_price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_table`
--

INSERT INTO `item_table` (`item_id`, `item_name`, `item_category`, `item_price`) VALUES
(1, 'NVIDIA GeForce RTX 3080', 'Graphics Card', 11200000),
(2, 'AMD Ryzen 9 5900X', 'CPU', 7686000),
(3, 'Corsair Vengeance LPX 16GB DDR4', 'RAM', 1819000),
(4, 'Samsung 970 EVO 1TB NVMe SSD', 'SSD', 2519000),
(5, 'Logitech G Pro Wireless', 'Gaming Gear', 2099000),
(6, 'SteelSeries Apex Pro', 'Mechanical Keyboard', 2799000),
(7, 'HyperX Cloud Alpha S', 'Gaming Gear', 1819000),
(8, 'ASUS ROG Swift PG279Q', 'Gaming Gear', 8399000),
(9, 'MSI GeForce RTX 3070', 'Graphics Card', 8399000),
(10, 'Intel Core i7-11700K', 'CPU', 4886000),
(11, 'G.Skill Trident Z RGB 32GB DDR4', 'RAM', 3499000),
(12, 'Western Digital WD Black 2TB NVMe SSD', 'SSD', 3499000),
(13, 'Razer DeathAdder V2', 'Gaming Gear', 979000),
(14, 'Ducky One 2 Mini', 'Mechanical Keyboard', 1679000),
(15, 'HyperX Cloud II', 'Gaming Gear', 1399000),
(16, 'Acer Predator XB273K', 'Gaming Gear', 9799000);

-- --------------------------------------------------------

--
-- Table structure for table `outgoing_item_table`
--

CREATE TABLE `outgoing_item_table` (
  `outgoing_item_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `outgoing_item_quantity` int(11) NOT NULL,
  `outgoing_item_date` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outgoing_item_table`
--

INSERT INTO `outgoing_item_table` (`outgoing_item_id`, `warehouse_id`, `outgoing_item_quantity`, `outgoing_item_date`) VALUES
(1, 4, 15, '2023-08-13 02:02:24.112'),
(2, 3, 4, '2023-08-13 02:02:48.890'),
(3, 1, 20, '2023-08-13 02:03:12.469');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_table`
--

CREATE TABLE `warehouse_table` (
  `warehouse_id` int(11) NOT NULL,
  `warehouse_quantity` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'In-stock'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse_table`
--

INSERT INTO `warehouse_table` (`warehouse_id`, `warehouse_quantity`, `item_id`, `status`) VALUES
(1, 70, 1, 'In-stock'),
(2, 15, 3, 'In-stock'),
(3, 0, 4, 'Empty'),
(4, 5, 5, 'Need Restock'),
(5, 25, 4, 'In-stock');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `incoming_item_table`
--
ALTER TABLE `incoming_item_table`
  ADD PRIMARY KEY (`incoming_item_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `item_table`
--
ALTER TABLE `item_table`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `outgoing_item_table`
--
ALTER TABLE `outgoing_item_table`
  ADD PRIMARY KEY (`outgoing_item_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `warehouse_table`
--
ALTER TABLE `warehouse_table`
  ADD PRIMARY KEY (`warehouse_id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `incoming_item_table`
--
ALTER TABLE `incoming_item_table`
  MODIFY `incoming_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `item_table`
--
ALTER TABLE `item_table`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `outgoing_item_table`
--
ALTER TABLE `outgoing_item_table`
  MODIFY `outgoing_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `warehouse_table`
--
ALTER TABLE `warehouse_table`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `incoming_item_table`
--
ALTER TABLE `incoming_item_table`
  ADD CONSTRAINT `incoming_item_table_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse_table` (`warehouse_id`);

--
-- Constraints for table `outgoing_item_table`
--
ALTER TABLE `outgoing_item_table`
  ADD CONSTRAINT `outgoing_item_table_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse_table` (`warehouse_id`);

--
-- Constraints for table `warehouse_table`
--
ALTER TABLE `warehouse_table`
  ADD CONSTRAINT `warehouse_table_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item_table` (`item_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
