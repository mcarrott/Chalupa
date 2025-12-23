-- Sample data for Chalupa Batman Fantasy Football League
-- Run this to populate your database with example data

-- Insert sample managers
INSERT INTO managers (name, quote, championships, total_seasons, total_wins, total_losses, playoff_appearances, last_place_finishes) VALUES
('Commissioner Dan', 'I didn''t choose the fantasy life, the fantasy life chose me', 2, 5, 45, 25, 4, 0),
('Big Mike', 'Always bet on yourself', 1, 5, 42, 28, 3, 1),
('Sarah Slinger', 'Defense wins championships', 1, 5, 48, 22, 5, 0),
('Tony Touchdown', 'Go big or go home', 0, 5, 35, 35, 2, 0),
('The Waiver Wire Wizard', 'Late round picks are my specialty', 0, 5, 38, 32, 3, 1),
('Playoff Pete', 'Regular season is just practice', 1, 5, 30, 40, 4, 0),
('Jenny the Giant Slayer', 'Upsets are my bread and butter', 0, 5, 32, 38, 1, 1),
('Captain Consistent', 'Slow and steady wins the race', 0, 5, 40, 30, 3, 0),
('Last Place Larry', 'Next year is my year!', 0, 5, 25, 45, 0, 2),
('The Analyst', 'Data doesn''t lie', 0, 5, 35, 35, 2, 0)
ON CONFLICT DO NOTHING;

-- Insert sample seasons (you'll need to update these IDs based on your actual manager IDs)
-- This is just a template - adjust accordingly

-- Insert sample highlights
INSERT INTO highlights (title, description, date, is_pinned) VALUES
('Record-Breaking Performance', 'Sarah Slinger scored 187.5 points in Week 7, setting a new league record!', '2024-10-20', true),
('The Great Trade Robbery', 'Tony traded his backup QB for a league winner. Genius or luck?', '2024-09-15', false),
('Playoff Thriller', 'Championship game came down to Monday Night Football - won by 0.8 points!', '2023-12-18', true),
('Draft Day Chaos', 'Power outage during Round 3 led to the most chaotic draft picks ever', '2024-08-25', false),
('Waiver Wire Gold', 'The Wizard picked up an unknown rookie who became league MVP', '2024-10-01', false),
('Rivalry Week Madness', 'All three rivalry matchups decided by less than 5 points combined', '2024-11-10', false)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, event_date, location) VALUES
('Draft Day 2025', 'Annual draft party - bring your spreadsheets and trash talk', '2025-08-30 18:00:00', 'Mike''s Backyard'),
('Week 6 Watch Party', 'Sunday football viewing at the sports bar', '2025-10-12 13:00:00', 'Buffalo Wild Wings'),
('Trade Deadline', 'Last chance to make moves before playoffs', '2025-11-15 23:59:00', 'Online'),
('Championship Game Viewing', 'Watch the finals together', '2025-12-21 13:00:00', 'Dan''s Place'),
('End of Season Awards Dinner', 'Trophy presentation and Sacko punishment reveal', '2026-01-10 19:00:00', 'TBD')
ON CONFLICT DO NOTHING;

-- Insert sample media folders
INSERT INTO media_folders (title, description, folder_url, season_year) VALUES
('2024 Season Highlights', 'Best moments from the 2024 season', 'https://drive.google.com/drive/folders/example-2024', 2024),
('2023 Championship Party', 'Photos from the championship celebration', 'https://drive.google.com/drive/folders/example-2023-party', 2023),
('Draft Day Photos', 'Collection of all our draft day photos', 'https://drive.google.com/drive/folders/example-draft', NULL),
('Trash Talk Screenshots', 'The best (and worst) league chat moments', 'https://drive.google.com/drive/folders/example-trash-talk', NULL),
('2022 Season Recap', 'Videos and photos from 2022', 'https://drive.google.com/drive/folders/example-2022', 2022)
ON CONFLICT DO NOTHING;

-- Note: To complete the sample data, you'll need to:
-- 1. Get the actual manager IDs from your database
-- 2. Create seasons with proper foreign key references
-- 3. Create season_placements for each season
-- 4. Add rivalries between managers
-- 5. Add some sample bets

-- Example queries to get manager IDs (run these first):
-- SELECT id, name FROM managers ORDER BY name;

-- Then use those IDs to create seasons, rivalries, and bets
