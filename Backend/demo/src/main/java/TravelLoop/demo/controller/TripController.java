package TravelLoop.demo.controller;

import TravelLoop.demo.dto.ActivityDTO;
import TravelLoop.demo.dto.BudgetCategoryDTO;
import TravelLoop.demo.dto.PackingItemDTO;
import TravelLoop.demo.dto.NoteDTO;
import TravelLoop.demo.dto.TripDTO;
import TravelLoop.demo.dto.TripStopDTO;
import TravelLoop.demo.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTripsForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<TripDTO> createTrip(@RequestBody TripDTO tripDTO) {
        return ResponseEntity.ok(tripService.createTrip(tripDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping("/{id}/stops")
    public ResponseEntity<TripDTO> addStop(@PathVariable Long id, @RequestBody TripStopDTO stopDTO) {
        return ResponseEntity.ok(tripService.addStop(id, stopDTO));
    }

    @PostMapping("/stops/{stopId}/activities")
    public ResponseEntity<TripDTO> addActivity(@PathVariable Long stopId, @RequestBody ActivityDTO activityDTO) {
        return ResponseEntity.ok(tripService.addActivity(stopId, activityDTO));
    }

    @PostMapping("/{tripId}/packing")
    public ResponseEntity<TripDTO> addPackingItem(@PathVariable Long tripId, @RequestBody PackingItemDTO itemDTO) {
        return ResponseEntity.ok(tripService.addPackingItem(tripId, itemDTO));
    }

    @PatchMapping("/packing/{itemId}/toggle")
    public ResponseEntity<TripDTO> togglePackingItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(tripService.togglePackingItem(itemId));
    }

    @PostMapping("/{tripId}/budget")
    public ResponseEntity<TripDTO> addBudgetCategory(@PathVariable Long tripId, @RequestBody BudgetCategoryDTO categoryDTO) {
        return ResponseEntity.ok(tripService.addBudgetCategory(tripId, categoryDTO));
    }

    @PatchMapping("/budget-categories/{categoryId}")
    public ResponseEntity<TripDTO> updateBudgetCategory(@PathVariable Long categoryId, @RequestBody BudgetCategoryDTO updatedDTO) {
        return ResponseEntity.ok(tripService.updateBudgetCategory(categoryId, updatedDTO));
    }

    @PostMapping("/{tripId}/notes")
    public ResponseEntity<TripDTO> addNote(@PathVariable Long tripId, @RequestBody NoteDTO noteDTO) {
        return ResponseEntity.ok(tripService.addNote(tripId, noteDTO));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TripDTO> markComplete(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.markComplete(id));
    }

    @PatchMapping("/{id}/cover-image")
    public ResponseEntity<TripDTO> updateCoverImage(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(tripService.updateCoverImage(id, body.get("coverImage")));
    }
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllTrips() {
        tripService.deleteAllTrips();
        return ResponseEntity.noContent().build();
    }
}
