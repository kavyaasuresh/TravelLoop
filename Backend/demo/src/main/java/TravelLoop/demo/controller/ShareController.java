package TravelLoop.demo.controller;

import TravelLoop.demo.dto.TripDTO;
import TravelLoop.demo.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/share")
@CrossOrigin(origins = "*")
public class ShareController {

    @Autowired
    private TripService tripService;

    @GetMapping("/{token}")
    public ResponseEntity<TripDTO> getSharedTrip(@PathVariable String token) {
        return ResponseEntity.ok(tripService.getTripByShareToken(token));
    }
}
