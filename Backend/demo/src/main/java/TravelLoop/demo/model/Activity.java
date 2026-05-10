package TravelLoop.demo.model;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "activities")
public class Activity {
    public Activity() {}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id", nullable = false)
    private TripStop tripStop;

    @Column(nullable = false)
    private String title;

    private String category;
    private double cost;
    private String startTime;
    private String endTime;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TripStop getTripStop() { return tripStop; }
    public void setTripStop(TripStop tripStop) { this.tripStop = tripStop; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
