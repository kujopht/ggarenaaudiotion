import React, { useState, useEffect } from 'react';
import { CloudSun, CloudRain, Sun, Snowflake, Wind, Droplets, Thermometer, Check, Sparkles, RefreshCw } from 'lucide-react';

export interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  weatherCode: number;
  conditionText: string;
  materialRecommendation: string;
  stylistTip: string;
  suggestedStyleId?: string;
}

const CITIES = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { id: 'hanoi', name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { id: 'hue', name: 'Huế (Cố Đô)', lat: 16.4637, lon: 107.5909 },
  { id: 'danang', name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { id: 'cantho', name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
];

function interpretWeather(temp: number, humidity: number, code: number): {
  conditionText: string;
  materialRecommendation: string;
  stylistTip: string;
  suggestedStyleId: string;
} {
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
  const isCold = temp < 20;
  const isHot = temp > 32;

  if (isRain) {
    return {
      conditionText: 'Trời mưa / Ẩm ướt',
      materialRecommendation: 'Vải đũi gai, cotton dệt thoáng, denim dày, tránh lụa tơ tằm nhạy cảm nước',
      stylistTip: 'Nên chọn phom tay chẽn gọn gàng, tránh vạt tà quá dài chấm đất và ưu tiên bốt da chống nước.',
      suggestedStyleId: 'indigo_denim',
    };
  }

  if (isCold) {
    return {
      conditionText: 'Trời lạnh / Mát dịu',
      materialRecommendation: 'Gấm dệt dày, nhung tuyết, dạ mỏng, phối layer áo trong giữ ấm',
      stylistTip: 'Lý tưởng để phối nhiều lớp (layering), khoác ngoài dáng duster coat mở tà kết hợp khăn đóng ấm áp.',
      suggestedStyleId: 'sartorial_tailored',
    };
  }

  if (isHot) {
    return {
      conditionText: 'Nắng nóng nhiệt đới',
      materialRecommendation: 'Linen tự nhiên, lụa tơ tằm mỏng nhẹ, vải xô đũi thoáng khí',
      stylistTip: 'Ưu tiên tone màu mát mắt (trắng ngà, xanh chàm nhạt), phom dáng rủ nhẹ thoải mái thấm hút mồ hôi.',
      suggestedStyleId: 'modern_minimal',
    };
  }

  // Temperate (20 - 32°C)
  return {
    conditionText: 'Thời tiết ôn hòa, dễ chịu',
    materialRecommendation: 'Lụa tơ tằm, linen pha cotton, denim mềm, lụa Hà Đông cao cấp',
    stylistTip: 'Thời tiết tuyệt vời để diện đầy đủ ngũ thân hoặc áo tấc dạo phố, chụp lookbook nghệ thuật.',
    suggestedStyleId: 'neo_indochine',
  };
}

interface WeatherAdvisorCardProps {
  onApplyRecommendation?: (materialTip: string, suggestedStyle?: string) => void;
}

export const WeatherAdvisorCard: React.FC<WeatherAdvisorCardProps> = ({
  onApplyRecommendation,
}) => {
  const [selectedCityId, setSelectedCityId] = useState('hcm');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const fetchWeather = async (cityId: string) => {
    const city = CITIES.find((c) => c.id === cityId) || CITIES[0];
    setLoading(true);
    setApplied(false);

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 6000);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weathercode`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutTimer);

      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const current = data.current;

      const temp = Math.round(current.temperature_2m ?? 29);
      const humidity = Math.round(current.relative_humidity_2m ?? 75);
      const code = current.weathercode ?? 1;

      const interpretation = interpretWeather(temp, humidity, code);

      setWeather({
        city: city.name,
        temp,
        humidity,
        weatherCode: code,
        ...interpretation,
      });
    } catch {
      // Graceful offline fallback
      const defaultInterp = interpretWeather(29, 72, 1);
      setWeather({
        city: city.name,
        temp: 29,
        humidity: 72,
        weatherCode: 1,
        ...defaultInterp,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCityId);
  }, [selectedCityId]);

  const handleApply = () => {
    if (!weather) return;
    onApplyRecommendation?.(weather.materialRecommendation, weather.suggestedStyleId);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  return (
    <div className="bg-[#181311]/80 rounded-xl p-3 border border-[#C9A66B]/20 text-xs space-y-2.5 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[#E6C88B] font-semibold">
          <CloudSun className="w-3.5 h-3.5 text-[#C9A66B]" />
          <span>Gợi ý chất liệu theo thời tiết thực tế</span>
        </div>

        {/* City Selector */}
        <select
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          className="bg-[#241A16] text-[#F2E9D8] text-[11px] border border-[#C9A66B]/30 rounded-lg px-2 py-1 focus:outline-none focus:border-[#C9A66B] cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {weather && (
        <div className="space-y-2">
          {/* Weather status strip */}
          <div className="flex items-center justify-between bg-[#1F1714] px-2.5 py-1.5 rounded-lg border border-[#C9A66B]/15">
            <div className="flex items-center gap-2">
              <span className="text-[#E6C88B] font-mono font-bold text-sm">
                {weather.temp}°C
              </span>
              <span className="text-[#8C7E6C]">·</span>
              <span className="text-[#B8AA96] text-[11px] flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#43B6A4]" />
                {weather.humidity}% ẩm
              </span>
              <span className="text-[#8C7E6C]">·</span>
              <span className="text-[#E6C88B] text-[11px] font-medium">
                {weather.conditionText}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fetchWeather(selectedCityId)}
              disabled={loading}
              className="text-[#8C7E6C] hover:text-[#C9A66B] transition-colors p-1"
              title="Làm mới thời tiết"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Advice */}
          <div className="text-[11px] space-y-1 leading-relaxed">
            <p className="text-[#D4C7B4]">
              <strong className="text-[#C9A66B]">Gợi ý vải: </strong>
              {weather.materialRecommendation}
            </p>
            <p className="text-[#8C7E6C] italic">
              💡 {weather.stylistTip}
            </p>
          </div>

          {/* Quick Apply Button */}
          {onApplyRecommendation && (
            <button
              type="button"
              onClick={handleApply}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                applied
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#2A1F1B] hover:bg-[#342621] border-[#C9A66B]/30 text-[#E6C88B]'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Đã áp dụng gợi ý vải vào thiết lập</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-[#E6C88B]" />
                  <span>Áp dụng gợi ý thời tiết vào bản phối</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
