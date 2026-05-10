package TravelLoop.demo.dto;

public class PackingItemDTO {
    public PackingItemDTO() {}
    private Long id;
    private String itemName;
    private String category;
    private boolean packed;
    private boolean suggested;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isPacked() { return packed; }
    public void setPacked(boolean packed) { this.packed = packed; }
    public boolean isSuggested() { return suggested; }
    public void setSuggested(boolean suggested) { this.suggested = suggested; }
}
