    DROP TABLE IF EXISTS Notifications
    CREATE TABLE Notifications (
        Id INT NOT NULL IDENTITY  PRIMARY KEY,
        NotificationText VARCHAR(255),
        UserId VARCHAR(255),
        Domain VARCHAR(255),
        IsEnabled BIT,
        created_ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER trgAfterUpdate ON Notifications
        AFTER UPDATE AS
		BEGIN 
			UPDATE Notifications
			SET updated_ts = GETDATE()
			FROM Notifications updated_row
			WHERE EXISTS (SELECT 1 FROM inserted i WHERE i.Id = updated_row.Id);
		END
    
    INSERT INTO Notifications (NotificationText, UserId, Domain, IsEnabled)
    VALUES ('Test Notification1', 'greg.mavridakhs@gmail.com', 'TnT', 0);
    INSERT INTO Notifications (NotificationText, UserId, Domain, IsEnabled)
    VALUES ('Test Notification2', 'greg.mavridakhs@gmail.com', 'TnT', 1);

    update Notifications 
    set IsEnabled = 0
    where userid = 'greg.mavridakhs@gmail.com' 
    AND Domain = 'TnT'
    AND NotificationText LIKE '%1%'

    select * from Notifications;