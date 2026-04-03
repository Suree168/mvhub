# คู่มือการเชื่อมต่อ API หนังจริง

## ภาพรวม

เว็บไซต์ MovieHub รองรับการเชื่อมต่อกับ **TMDB (The Movie Database) API** ซึ่งเป็น API หนังฟรีที่ให้ข้อมูลหนังครบถ้วนและอัพเดทตลอดเวลา

---

## ขั้นตอนการขอ API Key

### 1. สมัครสมาชิก TMDB
1. เข้าไปที่ [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. คลิก "Sign Up" และสมัครสมาชิก (ฟรี)
3. ยืนยันอีเมลของคุณ

### 2. ขอ API Key
1. ล็อกอินเข้าสู่ระบบ
2. ไปที่ Settings → API
3. คลิก "Create" หรือ "Request an API Key"
4. เลือก "Developer"
5. กรอกข้อมูลแอพพลิเคชั่นของคุณ
6. คัดลอก API Key ที่ได้

---

## การตั้งค่า API Key

### วิธีที่ 1: ใช้ Environment Variables (แนะนำ)

1. สร้างไฟล์ `.env` ในโฟลเดอร์ root ของโปรเจค:

```bash
cp .env.example .env
```

2. แก้ไขไฟล์ `.env`:

```env
VITE_TMDB_API_KEY=your_actual_api_key_here
```

3. รีสตาร์ทเซิร์ฟเวอร์:

```bash
npm run dev
```

### วิธีที่ 2: แก้ไขโค้ดโดยตรง (สำหรับทดสอบ)

แก้ไขไฟล์ `src/services/tmdbApi.ts`:

```typescript
const TMDB_API_KEY = 'your_actual_api_key_here';
```

---

## API Endpoints ที่ใช้ในโปรเจค

### 1. หนังยอดนิยม
```typescript
GET /movie/popular
```

### 2. หนังกำลังฉายในโรง
```typescript
GET /movie/now_playing
```

### 3. หนังที่กำลังจะเข้าฉาย
```typescript
GET /movie/upcoming
```

### 4. หนังเรตติ้งสูงสุด
```typescript
GET /movie/top_rated
```

### 5. รายละเอียดหนัง
```typescript
GET /movie/{movie_id}
```

### 6. ค้นหาหนัง
```typescript
GET /search/movie?query={search_query}
```

### 7. หนังตามประเภท
```typescript
GET /discover/movie?with_genres={genre_id}
```

### 8. หนังกำลังฮิต
```typescript
GET /trending/movie/week
```

### 9. ซีรี่ย์ยอดนิยม
```typescript
GET /tv/popular
```

---

## Custom Hooks ที่พร้อมใช้งาน

### usePopularMovies
```typescript
const { movies, loading, error } = usePopularMovies(page);
```

### useNowPlayingMovies
```typescript
const { movies, loading, error } = useNowPlayingMovies(page);
```

### useTopRatedMovies
```typescript
const { movies, loading, error } = useTopRatedMovies(page);
```

### useSearchMovies
```typescript
const { movies, loading, error, totalResults } = useSearchMovies(query, page);
```

### useMovieDetails
```typescript
const { movie, loading, error } = useMovieDetails(movieId);
```

### useTrending
```typescript
const { movies, loading, error } = useTrending('movie', 'week');
```

### useMoviesByGenre
```typescript
const { movies, loading, error } = useMoviesByGenre(genreId, page);
```

---

## ข้อจำกัดของ TMDB API (Free Tier)

| รายการ | จำกัด |
|--------|--------|
| Requests ต่อวินาที | 40 requests |
| Requests ต่อ IP | ไม่จำกัด |
| ข้อมูลย้อนหลัง | ครบถ้วน |
| รูปภาพ | มีให้ใช้ฟรี |

---

## การแก้ไขปัญหาเบื้องต้น

### ปัญหา: "Invalid API key"
**วิธีแก้:**
- ตรวจสอบว่า API Key ถูกต้อง
- ตรวจสอบว่าไฟล์ `.env` อยู่ในโฟลเดอร์ root
- รีสตาร์ทเซิร์ฟเวอร์หลังแก้ไข `.env`

### ปัญหา: "Network Error"
**วิธีแก้:**
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ตรวจสอบว่าไม่มี Firewall บล็อก

### ปัญหา: รูปภาพไม่โหลด
**วิธีแก้:**
- TMDB ใช้ CDN สำหรับรูปภาพ
- ตรวจสอบว่า `poster_path` ไม่เป็น null
- ใช้ placeholder image สำรอง

---

## การเพิ่ม API อื่นๆ

หากต้องการเพิ่ม API อื่น เช่น:

### OMDb API
```typescript
const OMDB_API_KEY = 'your_omdb_key';
const OMDB_BASE_URL = 'https://www.omdbapi.com';
```

### YouTube Trailer API
```typescript
const getTrailerUrl = (movieTitle: string) => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' trailer')}`;
};
```

---

## ตัวอย่างโค้ดการใช้งาน

### ดึงข้อมูลหนังยอดนิยม
```typescript
import { usePopularMovies } from '@/hooks/useMovies';

function PopularMoviesPage() {
  const { movies, loading, error } = usePopularMovies(1);

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

### ค้นหาหนัง
```typescript
import { useSearchMovies } from '@/hooks/useMovies';

function SearchPage() {
  const [query, setQuery] = useState('');
  const { movies, loading } = useSearchMovies(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาหนัง..."
      />
      {loading ? (
        <div>กำลังค้นหา...</div>
      ) : (
        movies.map(movie => <MovieCard key={movie.id} movie={movie} />)
      )}
    </div>
  );
}
```

---

## ลิงก์ที่เกี่ยวข้อง

- [TMDB Website](https://www.themoviedb.org/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Get API Key](https://www.themoviedb.org/settings/api)

---

## หมายเหตุ

- API Key ควรเก็บเป็นความลับ ไม่ควร push ขึ้น GitHub
- ใช้ `.env` และเพิ่ม `.env` ใน `.gitignore`
- สำหรับ production ควรใช้ backend proxy เพื่อซ่อน API Key
