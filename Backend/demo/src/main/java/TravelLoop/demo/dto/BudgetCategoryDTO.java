package TravelLoop.demo.dto;

public class BudgetCategoryDTO {
    public BudgetCategoryDTO() {}
    private Long id;
    private String category;
    private double estimatedCost;
    private double actualCost;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(double estimatedCost) { this.estimatedCost = estimatedCost; }
    public double getActualCost() { return actualCost; }
    public void setActualCost(double actualCost) { this.actualCost = actualCost; }
}
