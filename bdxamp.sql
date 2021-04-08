-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3308
-- Généré le :  jeu. 12 nov. 2020 à 11:50
-- Version du serveur :  8.0.18
-- Version de PHP :  7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `merise`
--

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `date` date NOT NULL,
  `effectif` tinyint(3) UNSIGNED NOT NULL,
  `couleur` varchar(7) NOT NULL,
  `prix` int(11) NOT NULL,
  `cinClient` bigint(20) UNSIGNED NOT NULL,
  `cinAdmin` bigint(20) NOT NULL,
  PRIMARY KEY (`date`),
  KEY `cinClient` (`cinClient`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 ;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`date`, `effectif`, `couleur`, `prix`, `cinClient`, `cinAdmin`) VALUES
('2020-11-30', 44, '#d20f0f', 400000, 101241455625, 0),
('2020-11-21', 10, '#d5cf10', 400000, 101241455625, 0),
('2020-11-25', 10, '#000000', 400000, 101241455626, 101241455625),
('2020-12-31', 20, '#000000', 400000, 101241455625, 0),
('2020-12-01', 5, '#000000', 400000, 101241455626, 0),
('2020-12-25', 5, '#000000', 400000, 101241455625, 0),
('2020-12-15', 5, '#000000', 400000, 101241455720, 0),
('2021-01-07', 20, '#000000', 400000, 101241455200, 0),
('2020-11-17', 52, '#d5cf10', 400000, 101241455625, 101241455625),
('2020-12-30', 10, '#000000', 400000, 101241455299, 101241455625),
('2020-11-29', 15, '#000000', 400000, 101241453000, 101241455625),
('2021-01-30', 20, '#000000', 400000, 101241455626, 101241455625);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `cinClient` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) CHARACTER SET utf8mb4  NOT NULL,
  `prenom` varchar(100) CHARACTER SET utf8mb4  NOT NULL,
  `adresse` varchar(255) CHARACTER SET utf8mb4  NOT NULL,
  `numero` int(10) UNSIGNED NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4  NOT NULL,
  `user` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cinClient`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 ;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`cinClient`, `nom`, `prenom`, `adresse`, `numero`, `password`, `user`) VALUES
(101241455626, 'safidy', 'angelo', '0322223768', 331233873, '123456789', 0),
(101241183443, 'safidy', 'angelo', '3E111TER', 322223768, 'safidyangelo', 0),
(101241455625, 'safidy', 'angelo', 'aaaaaa', 331233873, '123456789', 1),
(101241444555, 'safidy', 'angelo', '123', 322223768, '159', 0),
(101241444250, 'RAHARISEHENO', 'Sedraniaina', 'LOT III E 111 TER', 330270396, 'samuaRsedra', 1),
(101241500200, 'RASOARIVOLOLONA', 'zah', 'LOT III E 111 TER ', 331233812, '101241', 1),
(101241455620, 'RASOARIVOLOLONA', 'Samoelinirina', 'LOT III E 111 TER', 331233812, '123', 1),
(101241455624, 'RASOARIVOLOLONA', 'Samoelinirina', '0322223768', 331233812, '123', 1),
(101241250650, 'RASOARIVOLOLONA', 'Samoelinirina', '3E111TER', 331233896, '159632', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
