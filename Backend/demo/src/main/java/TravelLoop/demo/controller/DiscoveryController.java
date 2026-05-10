package TravelLoop.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    @GetMapping("/cities")
    public ResponseEntity<List<Map<String, String>>> searchCities(@RequestParam String q) {
        List<Map<String, String>> cities = new ArrayList<>();
        String query = q.toLowerCase();
        
        if (query.contains("lon")) {
            cities.add(Map.of("name", "London", "country", "UK", "costIndex", "High", "popularity", "9.5"));
        }
        if (query.contains("par")) {
            cities.add(Map.of("name", "Paris", "country", "France", "costIndex", "High", "popularity", "9.8"));
        }
        if (query.contains("tok")) {
            cities.add(Map.of("name", "Tokyo", "country", "Japan", "costIndex", "Medium", "popularity", "9.7"));
        }
        if (query.contains("new") || query.contains("nyc")) {
            cities.add(Map.of("name", "New York", "country", "USA", "costIndex", "High", "popularity", "9.9"));
        }
        if (query.contains("rom")) {
            cities.add(Map.of("name", "Rome", "country", "Italy", "costIndex", "Medium", "popularity", "9.6"));
        }
        
        if (cities.isEmpty()) {
            cities.add(Map.of("name", q, "country", "Unknown", "costIndex", "N/A", "popularity", "5.0"));
        }
        
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> searchActivities(@RequestParam String city) {
        List<Map<String, Object>> activities = new ArrayList<>();
        String cityName = city != null ? city.toLowerCase() : "";

        if (cityName.contains("paris")) {
            activities.add(Map.of("title", "Eiffel Tower Summit", "cost", 25.0, "category", "SIGHTSEEING", "duration", "2h"));
            activities.add(Map.of("title", "Louvre Museum Tour", "cost", 20.0, "category", "CULTURE", "duration", "4h"));
            activities.add(Map.of("title", "Seine River Cruise", "cost", 15.0, "category", "SIGHTSEEING", "duration", "1h"));
        } else if (cityName.contains("london")) {
            activities.add(Map.of("title", "London Eye Flight", "cost", 30.0, "category", "SIGHTSEEING", "duration", "1h"));
            activities.add(Map.of("title", "British Museum", "cost", 0.0, "category", "CULTURE", "duration", "3h"));
            activities.add(Map.of("title", "Afternoon Tea at Ritz", "cost", 60.0, "category", "FOOD", "duration", "2h"));
        } else {
            activities.add(Map.of("title", "City Walking Tour", "cost", 15.0, "category", "SIGHTSEEING", "duration", "2h"));
            activities.add(Map.of("title", "Local Market Visit", "cost", 0.0, "category", "FOOD", "duration", "1.5h"));
            activities.add(Map.of("title", "Central Landmark Visit", "cost", 10.0, "category", "CULTURE", "duration", "2h"));
        }
        
        return ResponseEntity.ok(activities);
    }
}
