package TravelLoop.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "packing_items")
public class PackingItem {
    public PackingItem() {}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String itemName;

    private String category;

    private boolean packed = false;

    private boolean suggested = false;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isPacked() { return packed; }
    public void setPacked(boolean packed) { this.packed = packed; }
    public boolean isSuggested() { return suggested; }
    public void setSuggested(boolean suggested) { this.suggested = suggested; }
}
