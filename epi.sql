CREATE TABLE `epi` (
  `id` integer PRIMARY KEY,
  `type` integer,
  `model` varchar(255),
  `brand` varchar(255),
  `serial_number` varchar(255),
  `uuid` varchar(255),
  `buy_date` timestamp,
  `production_date` timestamp,
  `service_date` timestamp,
  `height` int,
  `color` varchar(32)
);

CREATE TABLE `epi_controls` (
  `id` integer PRIMARY KEY,
  `epi_id` integer,
  `control_date` timestamp,
  `agent_control` varchar(100),
  `statut` varchar(32),
  `data` varchar(500)
);

CREATE TABLE `epi_types` (
  `id` integer PRIMARY KEY,
  `type` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `created_at` timestamp,
  `username` varchar(100),
  `password` varchar(255),
  `role` integer
);

CREATE TABLE `users_roles` (
  `id` integer PRIMARY KEY,
  `created_at` timestamp,
  `role` varchar(32),
  `user_created` integer
);

ALTER TABLE `users_roles` ADD FOREIGN KEY (`user_created`) REFERENCES `users` (`role`);

ALTER TABLE `epi` ADD FOREIGN KEY (`type`) REFERENCES `epi_types` (`id`);

ALTER TABLE `epi_controls` ADD FOREIGN KEY (`epi_id`) REFERENCES `epi` (`id`);
