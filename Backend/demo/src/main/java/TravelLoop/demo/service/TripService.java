package TravelLoop.demo.service;

import TravelLoop.demo.dto.ActivityDTO;
import TravelLoop.demo.dto.BudgetCategoryDTO;
import TravelLoop.demo.dto.PackingItemDTO;
import TravelLoop.demo.dto.TripDTO;
import TravelLoop.demo.dto.TripStopDTO;
import TravelLoop.demo.model.BudgetCategory;
import TravelLoop.demo.model.PackingItem;
import TravelLoop.demo.model.Trip;
import TravelLoop.demo.model.User;
import TravelLoop.demo.repository.BudgetCategoryRepository;
import TravelLoop.demo.repository.PackingItemRepository;
import TravelLoop.demo.repository.TripRepository;
import TravelLoop.demo.repository.UserRepository;
import TravelLoop.demo.repository.TripStopRepository;
import TravelLoop.demo.repository.ActivityRepository;
import TravelLoop.demo.repository.NoteRepository;
import TravelLoop.demo.model.Note;
import TravelLoop.demo.dto.NoteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripStopRepository stopRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PackingItemRepository packingRepository;

    @Autowired
    private BudgetCategoryRepository budgetCategoryRepository;

    @Autowired
    private NoteRepository noteRepository;

    public List<TripDTO> getAllTripsForCurrentUser() {
        User user = getCurrentUser();
        return tripRepository.findByUserOrderByStartDateDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TripDTO createTrip(TripDTO tripDTO) {
        User user = getCurrentUser();
        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(tripDTO.getTitle());
        trip.setDescription(tripDTO.getDescription());
        trip.setStartDate(tripDTO.getStartDate());
        trip.setEndDate(tripDTO.getEndDate());
        trip.setVisibility(tripDTO.getVisibility());
        trip.setStatus(tripDTO.getStatus());
        trip.setShareToken(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        return convertToDTO(tripRepository.save(trip));
    }

    public TripDTO addStop(Long tripId, TripStopDTO stopDTO) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        TravelLoop.demo.model.TripStop stop = new TravelLoop.demo.model.TripStop();
        stop.setTrip(trip);
        stop.setCityName(stopDTO.getCityName());
        stop.setCountry(stopDTO.getCountry());
        stop.setArrivalDate(stopDTO.getArrivalDate());
        stop.setDepartureDate(stopDTO.getDepartureDate());
        stop.setStopOrder(stopDTO.getStopOrder());
        stopRepository.save(stop);
        return getTripById(tripId);
    }

    public TripDTO addActivity(Long stopId, ActivityDTO activityDTO) {
        // Use fetch join so trip is loaded in same query — avoids LazyInitializationException
        TravelLoop.demo.model.TripStop stop = stopRepository.findByIdWithTrip(stopId).orElseThrow();
        Long tripId = stop.getTrip().getId();

        TravelLoop.demo.model.Activity activity = new TravelLoop.demo.model.Activity();
        activity.setTripStop(stop);
        activity.setTitle(activityDTO.getTitle());
        activity.setCategory(activityDTO.getCategory() != null ? activityDTO.getCategory() : "SIGHTSEEING");
        activity.setCost(activityDTO.getCost());
        activity.setStartTime(activityDTO.getStartTime());
        activity.setEndTime(activityDTO.getEndTime());
        activity.setNotes(activityDTO.getNotes());
        activityRepository.save(activity);

        // Fetch the trip fresh to safely access budget categories
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        if (trip.getBudgetCategories() == null) {
            trip.setBudgetCategories(new java.util.ArrayList<>());
        }
        BudgetCategory activitiesCat = trip.getBudgetCategories().stream()
                .filter(c -> c.getCategory().equalsIgnoreCase("Activities"))
                .findFirst()
                .orElseGet(() -> {
                    BudgetCategory newCat = new BudgetCategory();
                    newCat.setTrip(trip);
                    newCat.setCategory("Activities");
                    newCat.setEstimatedCost(0.0);
                    newCat.setActualCost(0.0);
                    return budgetCategoryRepository.save(newCat);
                });
        activitiesCat.setEstimatedCost(activitiesCat.getEstimatedCost() + activityDTO.getCost());
        budgetCategoryRepository.save(activitiesCat);

        return getTripById(tripId);
    }

    public TripDTO addPackingItem(Long tripId, PackingItemDTO itemDTO) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        PackingItem item = new PackingItem();
        item.setTrip(trip);
        item.setItemName(itemDTO.getItemName());
        item.setCategory(itemDTO.getCategory());
        item.setPacked(itemDTO.isPacked());
        item.setSuggested(itemDTO.isSuggested());
        packingRepository.save(item);
        return getTripById(tripId);
    }

    public TripDTO togglePackingItem(Long itemId) {
        PackingItem item = packingRepository.findById(itemId).orElseThrow();
        item.setPacked(!item.isPacked());
        packingRepository.save(item);
        return getTripById(item.getTrip().getId());
    }

    public TripDTO addBudgetCategory(Long tripId, BudgetCategoryDTO categoryDTO) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        BudgetCategory category = new BudgetCategory();
        category.setTrip(trip);
        category.setCategory(categoryDTO.getCategory());
        category.setEstimatedCost(categoryDTO.getEstimatedCost());
        category.setActualCost(0.0);
        budgetCategoryRepository.save(category);
        return getTripById(tripId);
    }

    public TripDTO addNote(Long tripId, NoteDTO noteDTO) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        Note note = new Note();
        note.setTrip(trip);
        note.setContent(noteDTO.getContent());
        note.setCreatedAt(java.time.LocalDateTime.now());
        noteRepository.save(note);
        return getTripById(tripId);
    }

    public TripDTO markComplete(Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        trip.setStatus(TravelLoop.demo.model.enums.TripStatus.COMPLETED);
        tripRepository.save(trip);
        return getTripById(tripId);
    }

    public TripDTO updateCoverImage(Long tripId, String coverImage) {
        Trip trip = tripRepository.findById(tripId).orElseThrow();
        trip.setCoverImage(coverImage);
        tripRepository.save(trip);
        return getTripById(tripId);
    }

    public TripDTO updateBudgetCategory(Long categoryId, BudgetCategoryDTO updatedDTO) {
        BudgetCategory category = budgetCategoryRepository.findById(categoryId).orElseThrow();
        category.setEstimatedCost(updatedDTO.getEstimatedCost());
        category.setActualCost(updatedDTO.getActualCost());
        budgetCategoryRepository.save(category);
        return getTripById(category.getTrip().getId());
    }

    public void deleteAllTrips() {
        tripRepository.deleteAll();
    }

    public TripDTO getTripById(Long id) {
        Trip trip = tripRepository.findById(id).orElseThrow();
        // Check if user owns trip or if it's public
        return convertToDTO(trip);
    }

    public TripDTO getTripByShareToken(String token) {
        Trip trip = tripRepository.findByShareToken(token).orElseThrow();
        return convertToDTO(trip);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private TripDTO convertToDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setTitle(trip.getTitle());
        dto.setDescription(trip.getDescription());
        dto.setStartDate(trip.getStartDate());
        dto.setEndDate(trip.getEndDate());
        dto.setVisibility(trip.getVisibility());
        dto.setCoverImage(trip.getCoverImage());
        dto.setStatus(trip.getStatus());
        dto.setShareToken(trip.getShareToken());

        if (trip.getStops() != null) {
            dto.setStops(trip.getStops().stream().map(stop -> {
                TripStopDTO stopDto = new TripStopDTO();
                stopDto.setId(stop.getId());
                stopDto.setCityName(stop.getCityName());
                stopDto.setCountry(stop.getCountry());
                stopDto.setArrivalDate(stop.getArrivalDate());
                stopDto.setDepartureDate(stop.getDepartureDate());
                stopDto.setStopOrder(stop.getStopOrder());
                
                if (stop.getActivities() != null) {
                    stopDto.setActivities(stop.getActivities().stream().map(activity -> {
                        ActivityDTO activityDto = new ActivityDTO();
                        activityDto.setId(activity.getId());
                        activityDto.setTitle(activity.getTitle());
                        activityDto.setCategory(activity.getCategory());
                        activityDto.setCost(activity.getCost());
                        activityDto.setStartTime(activity.getStartTime());
                        activityDto.setEndTime(activity.getEndTime());
                        activityDto.setNotes(activity.getNotes());
                        return activityDto;
                    }).collect(Collectors.toList()));
                }
                return stopDto;
            }).collect(Collectors.toList()));
        }

        // Calculate dynamic budget totals
        double totalEst = 0;
        if (trip.getBudgetCategories() != null) {
            totalEst = trip.getBudgetCategories().stream().mapToDouble(c -> c.getEstimatedCost()).sum();
        }
        dto.setTotalEstimatedCost(totalEst);

        double totalAct = 0;
        if (trip.getBudgetCategories() != null) {
            totalAct = trip.getBudgetCategories().stream().mapToDouble(c -> c.getActualCost()).sum();
        }
        dto.setTotalActualCost(totalAct);

        if (trip.getPackingItems() != null) {
            dto.setPackingItems(trip.getPackingItems().stream().map(item -> {
                PackingItemDTO itemDto = new PackingItemDTO();
                itemDto.setId(item.getId());
                itemDto.setItemName(item.getItemName());
                itemDto.setCategory(item.getCategory());
                itemDto.setPacked(item.isPacked());
                itemDto.setSuggested(item.isSuggested());
                return itemDto;
            }).collect(Collectors.toList()));
        }

        if (trip.getBudgetCategories() != null) {
            dto.setBudgetCategories(trip.getBudgetCategories().stream().map(cat -> {
                BudgetCategoryDTO catDto = new BudgetCategoryDTO();
                catDto.setId(cat.getId());
                catDto.setCategory(cat.getCategory());
                catDto.setEstimatedCost(cat.getEstimatedCost());
                catDto.setActualCost(cat.getActualCost());
                return catDto;
            }).collect(Collectors.toList()));
        }

        if (trip.getNotes() != null) {
            dto.setNotes(trip.getNotes().stream().map(note -> {
                NoteDTO nDto = new NoteDTO();
                nDto.setId(note.getId());
                nDto.setContent(note.getContent());
                nDto.setCreatedAt(note.getCreatedAt());
                return nDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
