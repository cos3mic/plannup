package planup.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import planup.backend.model.User;
import planup.backend.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByClerkId(String clerkId) {
        return userRepository.findByClerkId(clerkId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByOrganization(String organizationId) {
        return userRepository.findByOrganizationIdsContaining(organizationId);
    }

    public List<User> getUsersByProject(String projectId) {
        return userRepository.findByProjectIdsContaining(projectId);
    }

    public User createUser(User user) {
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        return userRepository.save(user);
    }

    public User updateUser(String id, User user) {
        user.setId(id);
        user.setUpdatedAt(new Date());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User createUserFromClerk(String clerkId, String email, String firstName, String lastName) {
        User user = User.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .fullName(firstName + " " + lastName)
                .avatar(String.valueOf(firstName.charAt(0)) + String.valueOf(lastName.charAt(0)))
                .createdAt(new Date())
                .updatedAt(new Date())
                .role("viewer")
                .permissions(List.of("view-reports"))
                .build();
        return userRepository.save(user);
    }
} 