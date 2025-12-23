# Chalupa Batman Fantasy Football League

A comprehensive website for managing your fantasy football league with style! Track managers, rivalries, bets, media, and historical records all in one place.

## Features

### 🏠 Home Page
- League highlights and memorable moments
- Upcoming events calendar
- Pinned important announcements

### 👥 Managers Page
- Profile pictures and personal quotes
- Career statistics (championships, wins, losses, playoff appearances)
- Win percentage calculations
- Last place finishes tracking

### 🔥 Thunder Dome
- Head-to-head rivalry tracking with records
- Bet and wager management with stakes and winners
- Status tracking (active, completed, cancelled)

### 📸 Media Gallery
- Links to external media folders (Google Drive, etc.)
- Season-specific photo and video collections
- Thumbnail previews

### 🏆 Legacy Page
- Complete historical record of all seasons
- Championship, runner-up, and last place tracking
- Detailed final standings with statistics
- Points for/against tracking

## Getting Started

### Database Setup

The database is already configured with Supabase. All tables and security policies are set up automatically.

### Adding Sample Data

To populate your database with example data:

1. Open the Supabase SQL Editor
2. Copy and paste the contents of `sample-data.sql`
3. Run the query
4. Adjust the data as needed for your league

### Environment Variables

Your `.env` file is already configured with:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Sleeper API Integration (Optional)

While the site works standalone, you can integrate with Sleeper's API to pull live data:

### Getting Your Sleeper League ID

1. Go to https://sleeper.app
2. Navigate to your league
3. The league ID is in the URL: `https://sleeper.app/leagues/YOUR_LEAGUE_ID`

### Storing Sleeper User IDs

In the `managers` table, there's a `sleeper_user_id` column where you can store each manager's Sleeper user ID. This allows for future integration features.

### Potential Sleeper Integration Features

You could extend the site to:
- Automatically sync rosters and scores
- Pull current week matchups
- Display live scoring updates
- Import draft results
- Sync standings automatically

**Note:** Implementing Sleeper API integration requires additional development. The current site provides the database structure to support this integration.

## Database Schema

### Tables Created

- **managers** - League member profiles and career stats
- **seasons** - Historical season records
- **season_placements** - Detailed standings for each season
- **rivalries** - Head-to-head matchup records
- **bets** - Wagers and side bets tracking
- **highlights** - Featured moments for the homepage
- **events** - Upcoming league events
- **media_folders** - Links to external media storage

### Security

All tables have Row Level Security (RLS) enabled:
- Public read access (anyone can view league data)
- Authenticated write access (admins can modify data)

## Customization Tips

### Changing Colors

The site uses a slate/amber color scheme. To change:
- Primary colors: Search for `amber-` and `orange-` in the code
- Background: Search for `slate-` classes
- Update in component files as needed

### Adding More Statistics

You can extend the database schema to track:
- Weekly high scores
- Best/worst draft picks
- Trade history
- Punishment records
- Custom awards

### Profile Pictures

Store profile image URLs in the `managers.profile_image_url` field. These can be:
- Uploaded to Supabase Storage
- Hosted on external services
- Direct image URLs

## Technology Stack

- **React** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and backend
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Future Enhancement Ideas

- Admin dashboard for managing content
- Authentication for different access levels
- Mobile app version
- Push notifications for events
- Live draft board
- Automated weekly recaps
- Integration with other fantasy platforms
- Custom team logos and branding
- League constitution/rules page
- Hall of fame section

## Support

For issues or questions, check the Supabase documentation at https://supabase.com/docs

---

Built with ❤️ for fantasy football enthusiasts
