package TravelLoop.demo.dto;

import TravelLoop.demo.model.enums.TripStatus;
import TravelLoop.demo.model.enums.Visibility;

import java.time.LocalDate;
import java.util.List;

public class TripDTO {
    public TripDTO() {}
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Visibility visibility;
    private String coverImage;
    private TripStatus status;
    private String shareToken;
    private List<TripStopDTO> stops;
    private List<PackingItemDTO> packingItems;
    private List<BudgetCategoryDTO> budgetCategories;
    private List<NoteDTO> notes;
    private Double totalEstimatedCost;
    private Double totalActualCost;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Visibility getVisibility() { return visibility; }
    public void setVisibility(Visibility visibility) { this.visibility = visibility; }
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }
    public List<TripStopDTO> getStops() { return stops; }
    public void setStops(List<TripStopDTO> stops) { this.stops = stops; }
    public List<PackingItemDTO> getPackingItems() { return packingItems; }
    public void setPackingItems(List<PackingItemDTO> packingItems) { this.packingItems = packingItems; }
    public List<BudgetCategoryDTO> getBudgetCategories() { return budgetCategories; }
    public void setBudgetCategories(List<BudgetCategoryDTO> budgetCategories) { this.budgetCategories = budgetCategories; }
    public List<NoteDTO> getNotes() { return notes; }
    public void setNotes(List<NoteDTO> notes) { this.notes = notes; }
    public Double getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(Double totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }
    public Double getTotalActualCost() { return totalActualCost; }
    public void setTotalActualCost(Double totalActualCost) { this.totalActualCost = totalActualCost; }
}
