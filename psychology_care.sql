-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2026 at 01:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psychology_care`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `professional_id` int(10) UNSIGNED NOT NULL,
  `appointment_datetime` datetime NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_online` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `professional_id`, `appointment_datetime`, `status`, `notes`, `created_at`, `is_online`) VALUES
(1, 7, 2, '2026-03-08 11:00:00', 'completed', 'vcghhgfghgfh', '2026-03-05 09:41:44', 0),
(2, 7, 2, '2026-03-09 11:00:00', 'pending', '', '2026-03-05 11:30:04', 0);

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(10) UNSIGNED NOT NULL,
  `professional_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`questions`)),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `professional_id`, `name`, `description`, `questions`, `created_at`) VALUES
(1, 2, 'cghhh', 'ghghgfhgfhgfhgfh', '[{\"text\":\"fdghhghghghg\",\"type\":\"rating\"},{\"text\":\"hfghfghfghgf\",\"type\":\"text\"},{\"text\":\"fghfghfghgf\",\"type\":\"boolean\"}]', '2026-03-05 10:33:56');

-- --------------------------------------------------------

--
-- Table structure for table `assessment_responses`
--

CREATE TABLE `assessment_responses` (
  `id` int(10) UNSIGNED NOT NULL,
  `assessment_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `responses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responses`)),
  `score` decimal(5,2) DEFAULT NULL,
  `response_date` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_responses`
--

INSERT INTO `assessment_responses` (`id`, `assessment_id`, `user_id`, `responses`, `score`, `response_date`, `notes`) VALUES
(1, 1, 7, '[{\"question\":\"fdghhghghghg\",\"answer\":\"4\"},{\"question\":\"hfghfghfghgf\",\"answer\":\"sdfsddsfdsfdsfdsf\"},{\"question\":\"fghfghfghgf\",\"answer\":\"Yes\"}]', 0.00, '2026-03-05 10:37:40', '');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `author_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` mediumtext NOT NULL,
  `publish_date` datetime DEFAULT current_timestamp(),
  `image_path_1` text DEFAULT NULL,
  `image_path_2` text DEFAULT NULL,
  `image_path_3` text DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `views` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `category_id`, `author_id`, `title`, `content`, `publish_date`, `image_path_1`, `image_path_2`, `image_path_3`, `status`, `views`) VALUES
(5, 1, 4, 'Mental health ', '<p data-start=\"126\" data-end=\"442\"><strong>Mental health </strong>care is rapidly evolving as technology, research, and awareness continue to grow across the world. In the past, mental health was often misunderstood and many people were reluctant to seek help. Today, societies are recognizing the importance of psychological wellbeing as a key part of overall health.</p>\n<p data-start=\"444\" data-end=\"854\"><em>One of the most important developments in mental health care is the use of digital technology. Online therapy platforms, mental health mobile applications, and virtual counseling services allow individuals to connect with professionals from the comfort of their homes. These digital solutions help reduce barriers such as distance, cost, and stigma that previously prevented many people from receiving support.</em></p>\n<p data-start=\"856\" data-end=\"1239\">Artificial intelligence and data analysis are also beginning to play a role in mental health treatment. These technologies can help professionals detect early signs of conditions such as anxiety, depression, and stress by analyzing patterns in behavior and communication. Early detection allows healthcare providers to offer support and treatment before problems become more serious.</p>\n<p data-start=\"1241\" data-end=\"1654\">Another important aspect of the future of mental health care is community awareness and education. Schools, workplaces, and organizations are increasingly implementing mental wellness programs to help individuals manage stress and maintain a healthy work-life balance. These programs encourage open conversations and create supportive environments where people feel safe discussing their mental health challenges.</p>\n<p data-start=\"1656\" data-end=\"2084\">In the coming years, mental health care is expected to become more personalized and accessible. Integrating traditional therapy with digital tools, community support systems, and preventive care will help millions of people maintain better mental wellbeing. By continuing to invest in research, education, and technology, society can build a future where mental health care is available, effective, and stigma-free for everyone.</p>', '2026-03-05 09:25:45', '/uploads/1772682936358.jpeg', '/uploads/1772682939810.jpeg', '/uploads/1772682942711.jpeg', 'published', 0),
(6, 1, 2, 'xvcbxbxx', '<p>xcvcxvcxvcxv</p>', '2026-03-05 17:54:07', '', '', '', 'published', 0);

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `cat_image_path` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `description`, `cat_image_path`, `created_at`) VALUES
(1, 'dsdfs', 'sdfsdfdf', '/uploads/1772682409019.jpeg', '2026-03-05 09:16:49');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(10) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `patient_id` int(10) UNSIGNED NOT NULL,
  `doctor_id` int(10) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `appointment_id`, `patient_id`, `doctor_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 7, 2, 5, 'good pcycologist', '2026-03-05 10:58:43');

-- --------------------------------------------------------

--
-- Table structure for table `journals`
--

CREATE TABLE `journals` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `journal_date` date NOT NULL,
  `entry` mediumtext NOT NULL,
  `sentiment_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sentiment_analysis`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journals`
--

INSERT INTO `journals` (`id`, `user_id`, `journal_date`, `entry`, `sentiment_analysis`, `created_at`, `updated_at`) VALUES
(1, 7, '2026-03-01', 'bad', NULL, '2026-03-05 09:32:34', '2026-03-05 16:22:23'),
(2, 7, '2026-03-02', 'i am sad', NULL, '2026-03-05 09:39:01', '2026-03-05 16:09:10'),
(3, 7, '2026-03-03', 'sad more', NULL, '2026-03-05 16:16:21', '2026-03-05 16:16:21'),
(4, 7, '2026-03-04', 'very bad day', NULL, '2026-03-05 16:16:31', '2026-03-05 16:16:31'),
(5, 7, '2026-03-05', 'bad', NULL, '2026-03-05 16:16:41', '2026-03-05 16:22:09');

-- --------------------------------------------------------

--
-- Table structure for table `moods`
--

CREATE TABLE `moods` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `mood_date` date NOT NULL,
  `mood_level` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `sentiment_score` decimal(5,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `moods`
--

INSERT INTO `moods` (`id`, `user_id`, `mood_date`, `mood_level`, `note`, `sentiment_score`, `created_at`) VALUES
(1, 7, '2026-03-01', 1, '', NULL, '2026-03-05 09:32:34'),
(2, 7, '2026-03-02', 1, '', NULL, '2026-03-05 09:39:01'),
(6, 7, '2026-03-03', 1, '', NULL, '2026-03-05 16:16:21'),
(7, 7, '2026-03-04', 2, '', NULL, '2026-03-05 16:16:31'),
(8, 7, '2026-03-05', 1, '', NULL, '2026-03-05 16:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `patient_details`
--

CREATE TABLE `patient_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `age` int(10) UNSIGNED DEFAULT NULL,
  `gender` enum('male','female','non-binary','prefer_not_to_say') DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `medical_history` text DEFAULT NULL,
  `stress_triggers` text DEFAULT NULL,
  `profile_pic_path` text DEFAULT NULL,
  `marital_status` enum('Single','Married','In a Relationship') DEFAULT NULL,
  `employment_status` enum('Employed','Unemployed') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_details`
--

INSERT INTO `patient_details` (`id`, `user_id`, `age`, `gender`, `address`, `phone`, `medical_history`, `stress_triggers`, `profile_pic_path`, `created_at`, `updated_at`) VALUES
(1, 4, 23, 'male', '281/1,Alokamawatha, Pannegamuwa, Weerawila', '', 'Savindu Manahara is a 23-year-old individual with no significant past medical history. He reports being generally healthy with no known chronic illnesses, major surgeries, or long-term medications. There are no known drug allergies. Vaccinations are up to date as per standard recommendations. He maintains an active lifestyle and has not reported any major hospitalizations in the past. Routine medical checkups are recommended to maintain overall health and wellbeing.', '', '/uploads/1772681200945.jpg', '2026-03-05 08:57:19', '2026-03-05 08:57:19'),
(2, 7, 25, 'male', 'adfgsdd', '06775675665', 'fdfdsfdsfdsfdf', 'fsdfdsfdfdf,srgfdgfg,dfgfg', '/uploads/profiles/profile-1772685993806-357212913.jpg', '2026-03-05 09:46:56', '2026-03-05 10:16:33');

-- --------------------------------------------------------

--
-- Table structure for table `professional_details`
--

CREATE TABLE `professional_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `category` enum('Psychiatrist','Psychologist','Counselor') DEFAULT NULL,
  `experience_years` int(10) UNSIGNED DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profile_pic_path` text DEFAULT NULL,
  `availability` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`availability`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `online_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `professional_details`
--

INSERT INTO `professional_details` (`id`, `user_id`, `qualification`, `specialty`, `experience_years`, `license_number`, `bio`, `profile_pic_path`, `availability`, `created_at`, `updated_at`, `online_available`) VALUES
(1, 2, 'MBBS (Bachelor of Medicine, Bachelor of Surgery)', 'General Medicine & Primary Healthcare', 8, 'SLMC-45872', 'Dr. Savindu Manahara is a dedicated medical professional with experience in general medicine and primary healthcare. He specializes in diagnosing and treating common medical conditions while providing preventive healthcare guidance to patients. Dr. Savindu is committed to delivering patient-centered care, promoting healthy lifestyles, and ensuring the wellbeing of individuals through accurate diagnosis and effective treatment plans. He continuously updates his medical knowledge to provide high-quality healthcare services.', '/uploads/profiles/profile-1772686418681-987307509.jpg', NULL, '2026-03-05 08:58:36', '2026-03-05 10:23:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','doctor','professional','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Dr. Smith', 'doctor@psycare.com', '$2b$10$xKvFUI.ubQbNwZ8AjlmWheyNr3uT1rNeg4Ofmp2PaRIHfkXysyuve', 'doctor', '2026-03-05 03:16:22'),
(3, 'John Doe', 'customer@psycare.com', '$2b$10$aHEnuq0kFkgOnA5rzbMETe8T4l8kBQnNuDem/ox6qQOWFX2P6pQte', 'customer', '2026-03-05 03:16:22'),
(4, 'Savi Abeysooriyat', 'saviabtteysooriya@gmail.com', '$2b$10$QYThNKwmbQQPWDbzy2qsnePvkCoZzlCBYiP2Adt/jUCekgu8xQ4d2', 'customer', '2026-03-05 03:27:19'),
(5, 'savi d man', 'saviabeyfgfgfgsooriya@gmail.com', '$2b$10$c8ASUX4lt8l70hl8cACVSuy8JfejppZgoWQM8.BzXQ6yXpy9Q7IF6', 'doctor', '2026-03-05 03:28:36'),
(6, 'Savi Abeysooriyafgfgfff', 'sagfgfgviabeysooriya@gmail.com', '$2b$10$7jVSn/Gaz37F8C5CfZ6fcOULoe0ahidavnWl30Om5B.6exzyOvnDa', 'admin', '2026-03-05 03:28:54'),
(7, 'savicus', 'saviabeysooriya@gmail.com', '$2b$10$xKvFUI.ubQbNwZ8AjlmWheyNr3uT1rNeg4Ofmp2PaRIHfkXysyuve', 'customer', '2026-03-05 03:57:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prof_appoint_time` (`professional_id`,`appointment_datetime`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `professional_id` (`professional_id`);

--
-- Indexes for table `assessment_responses`
--
ALTER TABLE `assessment_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_assessment` (`user_id`,`assessment_id`),
  ADD KEY `assessment_id` (`assessment_id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `author_id` (`author_id`);
ALTER TABLE `blogs` ADD FULLTEXT KEY `idx_search` (`title`,`content`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `journals`
--
ALTER TABLE `journals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_date` (`user_id`,`journal_date`);

--
-- Indexes for table `moods`
--
ALTER TABLE `moods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_mood_date` (`user_id`,`mood_date`);

--
-- Indexes for table `patient_details`
--
ALTER TABLE `patient_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `professional_details`
--
ALTER TABLE `professional_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `assessment_responses`
--
ALTER TABLE `assessment_responses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `journals`
--
ALTER TABLE `journals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `moods`
--
ALTER TABLE `moods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `patient_details`
--
ALTER TABLE `patient_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `professional_details`
--
ALTER TABLE `professional_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assessment_responses`
--
ALTER TABLE `assessment_responses`
  ADD CONSTRAINT `assessment_responses_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessment_responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journals`
--
ALTER TABLE `journals`
  ADD CONSTRAINT `journals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `moods`
--
ALTER TABLE `moods`
  ADD CONSTRAINT `moods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patient_details`
--
ALTER TABLE `patient_details`
  ADD CONSTRAINT `patient_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `professional_details`
--
ALTER TABLE `professional_details`
  ADD CONSTRAINT `professional_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
