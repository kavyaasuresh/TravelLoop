package TravelLoop.demo.repository;

import TravelLoop.demo.model.Note;
import TravelLoop.demo.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByTripOrderByCreatedAtDesc(Trip trip);
}
