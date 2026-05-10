package TravelLoop.demo.repository;

import TravelLoop.demo.model.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackingItemRepository extends JpaRepository<PackingItem, Long> {
}
