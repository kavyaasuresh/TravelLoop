package TravelLoop.demo.repository;

import TravelLoop.demo.model.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface TripStopRepository extends JpaRepository<TripStop, Long> {
    @Query("SELECT s FROM TripStop s JOIN FETCH s.trip WHERE s.id = :id")
    Optional<TripStop> findByIdWithTrip(@Param("id") Long id);
}
