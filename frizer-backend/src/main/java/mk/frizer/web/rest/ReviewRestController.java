package mk.frizer.web.rest;

import mk.frizer.domain.Review;
import mk.frizer.domain.dto.ReviewAddDTO;
import mk.frizer.domain.dto.ReviewUpdateDTO;
import mk.frizer.domain.dto.simple.ReviewSimpleDTO;
import mk.frizer.domain.exceptions.ReviewNotFoundException;
import mk.frizer.domain.exceptions.UserNotFoundException;
import mk.frizer.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping({"/api/reviews", "/api/review"})
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReviewRestController {
    private final ReviewService reviewService;

    public ReviewRestController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping()
    public List<ReviewSimpleDTO> getAllReviews(){
        return reviewService.getReviews().stream().map(Review::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewSimpleDTO> getReview(@PathVariable Long id){
        return this.reviewService.getReviewById(id)
                .map(review -> ResponseEntity.ok().body(review.toDto()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping("/add-for-employee")
    @PostMapping("/add")
    public ResponseEntity<ReviewSimpleDTO> createReviewForEmployee(@RequestBody ReviewAddDTO reviewAddDto) {
        return this.reviewService.createReviewForEmployee(reviewAddDto)
                .map(review -> ResponseEntity.ok().body(review.toDto()))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

//    @PostMapping("/add-for-customer")
//    public ResponseEntity<ReviewSimpleDTO> createReviewForCustomer(@RequestBody ReviewAddDTO reviewAddDto) {
//        System.out.println(reviewAddDto);
//        return this.reviewService.createReviewForCustomer(reviewAddDto)
//                .map(review -> ResponseEntity.ok().body(review.toDto()))
//                .orElseGet(() -> ResponseEntity.badRequest().build());
//    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ReviewSimpleDTO> updateReview(@PathVariable Long id, @RequestBody ReviewUpdateDTO reviewUpdateDTO) {
        return this.reviewService.updateReview(id, reviewUpdateDTO)
                .map(review -> ResponseEntity.ok().body(review.toDto()))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ReviewSimpleDTO> deleteReviewById(@PathVariable Long id) {
        Optional<Review> review = this.reviewService.deleteReviewById(id);
        try{
            this.reviewService.getReviewById(id);
            return ResponseEntity.badRequest().build();
        }
        catch(ReviewNotFoundException exception){
            return ResponseEntity.ok().body(review.get().toDto());
        }
    }
}
