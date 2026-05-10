package TravelLoop.demo.repository;

import TravelLoop.demo.model.Trip;
import TravelLoop.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserOrderByStartDateDesc(User user);
    Optional<Trip> findByShareToken(String shareToken);
}
