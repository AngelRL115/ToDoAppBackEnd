-- -----------------------------------------------------
-- Schema todolistapp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `todolistapp` DEFAULT CHARACTER SET utf8 ;
USE `todolistapp` ;

-- -----------------------------------------------------
-- Table `todolistapp`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `todolistapp`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NULL,
  `Username` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `todolistapp`.`TaskStatus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `todolistapp`.`TaskStatus` (
  `idStatus` INT NOT NULL AUTO_INCREMENT,
  `StatusName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idStatus`),
  UNIQUE INDEX `StatusName_UNIQUE` (`StatusName` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `todolistapp`.`Task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `todolistapp`.`Task` (
  `idTask` INT NOT NULL AUTO_INCREMENT,
  `User_idUser` INT NOT NULL,
  `Title` VARCHAR(100) NULL,
  `Description` TEXT NULL,
  `Status_idStatus` INT NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTask`),
  INDEX `fk_Task_User_idx` (`User_idUser` ASC),
  INDEX `fk_Task_Status_idx` (`Status_idStatus` ASC),
  CONSTRAINT `fk_Task_User`
    FOREIGN KEY (`User_idUser`)
    REFERENCES `todolistapp`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Task_Status`
    FOREIGN KEY (`Status_idStatus`)
    REFERENCES `todolistapp`.`TaskStatus` (`idStatus`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `todolistapp`.`TaskStatus` (`idStatus`, `StatusName`) VALUES ('1', 'complete');
INSERT INTO `todolistapp`.`TaskStatus` (`idStatus`, `StatusName`) VALUES ('2', 'pending');